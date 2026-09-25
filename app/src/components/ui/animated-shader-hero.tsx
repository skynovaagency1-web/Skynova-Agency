import React, { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Full-bleed hero over an animated WebGL2 fragment shader.
 *
 * Shader by Matthias Hurrle (@atzedent); kept verbatim at the bottom of this
 * file.
 *
 * PORTED, NOT PASTED. Four things in the original source do not work in this
 * codebase, and each is recorded where it is fixed:
 *
 *  1. `<style jsx>` is styled-jsx, which is a Next.js feature. This is Vite
 *     plus TanStack Start and styled-jsx is not installed, so that block would
 *     have rendered a literal `jsx` attribute on a <style> tag and shipped no
 *     animations at all. The keyframes now live in styles.css with the other
 *     thirty-three, which is this project's convention.
 *  2. The renderer and pointer classes were declared INSIDE the hook, so React
 *     rebuilt both class objects on every single render. They are module-level
 *     here.
 *  3. `useRef<number>()` with no argument is an error under React 19's types.
 *  4. Tailwind class names built by string interpolation (`text-${...}-300`)
 *     are invisible to Tailwind's scanner, which reads source files as text.
 *     Those colours were never generated. The badge icons are a static class.
 *
 * Two additions this site needs and the original has no notion of: the loop
 * stops when the hero is off screen or the tab is hidden, and it does not run
 * at all under prefers-reduced-motion. A fragment shader painting every frame
 * forever is a real battery cost, and this site already learned that lesson
 * with its video backdrop.
 */

export interface HeroProps {
  trustBadge?: {
    text: string;
    icons?: string[];
  };
  headline: {
    line1: string;
    line2: string;
  };
  subtitle: string;
  buttons?: {
    primary?: {
      text: string;
      onClick?: () => void;
    };
    secondary?: {
      text: string;
      onClick?: () => void;
    };
  };
  className?: string;
}

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

const VERTICES = [-1, 1, -1, -1, 1, 1, 1, -1];

type UniformMap = {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  move: WebGLUniformLocation | null;
  touch: WebGLUniformLocation | null;
  pointerCount: WebGLUniformLocation | null;
  pointers: WebGLUniformLocation | null;
};

class WebGLRenderer {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buffer: WebGLBuffer | null = null;
  private scale: number;
  private shaderSource: string;
  private uniforms: UniformMap | null = null;
  private mouseMove: [number, number] = [0, 0];
  private mouseCoords: [number, number] = [0, 0];
  private pointerCoords: number[] = [0, 0];
  private nbrOfPointers = 0;

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, scale: number) {
    this.canvas = canvas;
    this.gl = gl;
    this.scale = scale;
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
    this.shaderSource = defaultShaderSource;
  }

  updateShader(source: string) {
    this.reset();
    this.shaderSource = source;
    this.setup();
    this.init();
  }

  updateMove(deltas: [number, number]) {
    this.mouseMove = deltas;
  }

  updateMouse(coords: [number, number]) {
    this.mouseCoords = coords;
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale: number) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
    }
  }

  /** Compile-checks a source without disturbing the live program. */
  test(source: string) {
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!shader) return "could not create shader";
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const result = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
      ? null
      : gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;
    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }
      gl.deleteProgram(this.program);
    }
    // The buffer was never released in the original, so every updateShader
    // leaked one. Unmounting a hero repeatedly leaked one per mount.
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    this.program = null;
    this.uniforms = null;
  }

  setup() {
    const gl = this.gl;
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;

    this.vs = vs;
    this.fs = fs;
    this.compile(vs, VERTEX_SRC);
    this.compile(fs, this.shaderSource);
    this.program = program;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }
  }

  init() {
    const gl = this.gl;
    const program = this.program;
    if (!program) return;

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(VERTICES), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // Held in a typed map rather than bolted onto the WebGLProgram with
    // `as any`, which is what the original did.
    this.uniforms = {
      resolution: gl.getUniformLocation(program, "resolution"),
      time: gl.getUniformLocation(program, "time"),
      move: gl.getUniformLocation(program, "move"),
      touch: gl.getUniformLocation(program, "touch"),
      pointerCount: gl.getUniformLocation(program, "pointerCount"),
      pointers: gl.getUniformLocation(program, "pointers"),
    };
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;
    const u = this.uniforms;
    if (!program || !u || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    gl.uniform2f(u.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.time, now * 1e-3);
    gl.uniform2f(u.move, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(u.touch, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(u.pointerCount, this.nbrOfPointers);
    gl.uniform2fv(u.pointers, this.pointerCoords);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  private scale: number;
  private active = false;
  private pointers = new Map<number, [number, number]>();
  private lastCoords: [number, number] = [0, 0];
  private moves: [number, number] = [0, 0];
  private element: HTMLCanvasElement;
  private handlers: Array<[string, (e: PointerEvent) => void]> = [];

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale;
    this.element = element;

    const map = (x: number, y: number): [number, number] => [
      x * this.scale,
      element.height - y * this.scale,
    ];

    const down = (e: PointerEvent) => {
      this.active = true;
      this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
    };
    const release = (e: PointerEvent) => {
      if (this.count === 1) this.lastCoords = this.first;
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    };
    const move = (e: PointerEvent) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
      this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
    };

    // Kept so they can be removed again. The original attached four listeners
    // and never detached any of them.
    this.handlers = [
      ["pointerdown", down],
      ["pointerup", release],
      ["pointerleave", release],
      ["pointermove", move],
    ];
    for (const [type, fn] of this.handlers) {
      element.addEventListener(type, fn as EventListener);
    }
  }

  dispose() {
    for (const [type, fn] of this.handlers) {
      this.element.removeEventListener(type, fn as EventListener);
    }
    this.handlers = [];
    this.pointers.clear();
  }

  updateScale(scale: number) {
    this.scale = scale;
  }

  get count() {
    return this.pointers.size;
  }

  get move(): [number, number] {
    return this.moves;
  }

  get coords(): number[] {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0];
  }

  get first(): [number, number] {
    return this.pointers.values().next().value ?? this.lastCoords;
  }
}

/**
 * Drives the canvas. Returns the ref to attach.
 *
 * The loop is not unconditional. It runs only while the canvas is on screen
 * and the tab is visible, and never under prefers-reduced-motion -- in which
 * case a single frame is painted so the hero is a still image rather than a
 * black rectangle.
 */
function useShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    // No WebGL2 means no shader. The overlay copy still renders over the
    // black background, which is a worse hero but a working page.
    if (!gl) {
      console.warn("animated-shader-hero: WebGL2 unavailable, shader disabled.");
      return;
    }

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

    const renderer = new WebGLRenderer(canvas, gl, dpr);
    const pointers = new PointerHandler(canvas, dpr);

    renderer.setup();
    renderer.init();

    /**
     * Sized from the CANVAS, not the window.
     *
     * The original set `canvas.width = window.innerWidth`, which silently
     * assumes the hero is always exactly the viewport. Rendered in any
     * narrower container the drawing buffer and the element disagree, and the
     * shader -- which works in `min(R.x,R.y)` -- stretches. Measured here at a
     * 1200px viewport inside a 60px container: buffer said 1200, element was
     * 60.
     *
     * Reading the element's own box costs nothing and is correct in both
     * cases, since a full-bleed hero's box IS the viewport.
     */
    const resize = () => {
      const next = Math.max(1, 0.5 * window.devicePixelRatio);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * next));
      const h = Math.max(1, Math.round(rect.height * next));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      renderer.updateScale(next);
      pointers.updateScale(next);
    };
    resize();

    if (renderer.test(defaultShaderSource) === null) {
      renderer.updateShader(defaultShaderSource);
    }

    let frame = 0;
    let running = false;

    const loop = (now: number) => {
      renderer.updateMouse(pointers.first);
      renderer.updatePointerCount(pointers.count);
      renderer.updatePointerCoords(pointers.coords);
      renderer.updateMove(pointers.move);
      renderer.render(now);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    if (reduceMotion) {
      // One frame, then nothing moves.
      renderer.render(0);
    } else {
      start();
    }

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Scrolled past the hero, the shader stops. This is the single biggest
    // saving here: a full-screen fragment shader is not cheap, and on a long
    // page it would otherwise keep painting all the way to the footer.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    // A container can change width without the window doing anything -- a
    // sidebar opening, a layout shift. window resize alone would miss it.
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      pointers.dispose();
      renderer.reset();
    };
  }, []);

  return canvasRef;
}

/**
 * The shader on its own, for callers that want to compose their own overlay
 * rather than take this file's copy layout.
 *
 * Exported because skynovaagency's hero carries HeroCards and its own
 * translated copy; wrapping the default Hero would have meant either
 * duplicating the canvas setup or bending HeroProps into something it is not.
 */
export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useShaderBackground();
  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full touch-none", className)}
      style={{ background: "black" }}
      aria-hidden="true"
    />
  );
}

const Hero: React.FC<HeroProps> = ({ trustBadge, headline, subtitle, buttons, className }) => {
  const canvasRef = useShaderBackground();

  return (
    <div className={cn("relative h-screen w-full overflow-hidden bg-black", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        style={{ background: "black" }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        {trustBadge && (
          <div className="shader-hero-in-down mb-8">
            <div className="flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-500/10 px-6 py-3 text-sm backdrop-blur-md">
              {trustBadge.icons && (
                <div className="flex">
                  {trustBadge.icons.map((icon, index) => (
                    // Static class. The original interpolated the colour into
                    // the class name, which Tailwind never sees.
                    <span key={index} className="text-amber-300">
                      {icon}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-orange-100">{trustBadge.text}</span>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-5xl space-y-6 px-4 text-center">
          <div className="space-y-2">
            <h1 className="shader-hero-in-up shader-hero-delay-200 bg-gradient-to-r from-orange-300 via-yellow-400 to-amber-300 bg-clip-text text-5xl font-bold text-transparent md:text-7xl lg:text-8xl">
              {headline.line1}
            </h1>
            {/* Second line is a <p>, not a second <h1>. Two h1s on one page is
                the exact warning the Sep 2026 audit raised, and it is a
                styling choice rather than a second document heading. */}
            <p className="shader-hero-in-up shader-hero-delay-400 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-5xl font-bold text-transparent md:text-7xl lg:text-8xl">
              {headline.line2}
            </p>
          </div>

          <div className="shader-hero-in-up shader-hero-delay-600 mx-auto max-w-3xl">
            <p className="text-lg font-light leading-relaxed text-orange-100/90 md:text-xl lg:text-2xl">
              {subtitle}
            </p>
          </div>

          {buttons && (
            <div className="shader-hero-in-up shader-hero-delay-800 mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              {buttons.primary && (
                <button
                  type="button"
                  onClick={buttons.primary.onClick}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-orange-600 hover:to-yellow-600 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button
                  type="button"
                  onClick={buttons.secondary.onClick}
                  className="rounded-full border border-orange-300/30 bg-orange-500/10 px-8 py-4 text-lg font-semibold text-orange-100 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-orange-300/50 hover:bg-orange-500/20"
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*
*	To explore strange new worlds, to seek out new life
*	and new civilizations, to boldly go where no man has
*	gone before.
*/
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
// Returns a pseudo random number for a given point (white noise)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
// Returns a pseudo random number for a given point (value noise)
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
// Returns a pseudo random number for a given point (fractal noise)
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
	}
	O=vec4(col,1);
}`;

export default Hero;
