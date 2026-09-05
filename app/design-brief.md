# Skynova Agency — design brief

## Design read
For independent travelers and digital nomads who want to book an entire trip
- flight, stay, car, connectivity, tickets, and activities - from one place
instead of six tabs. Register: confident, in-motion, quietly premium; a
red-eye giving way to a clear dawn.

## Concept spine
Journey/waypoints: the brand IS a flight from night into first light. The
scroll-scrub film carries this literally (a paper-craft plane crossing a
night sky into sunrise); every vertical below is a waypoint on that same
trip (book the flight, land, stay, move, connect, go out, explore).

## Delivery tier
cinema (Lenis+GSAP, Tier-1 hero, scroll chapters - carries the animated
website).

## Locked palette
- Base / dark ground: #131A3A (cobalt night-sky navy - chromatic, not
  graphite near-black)
- Ink (on dark): #F5F1E6 (warm dawn-paper off-white)
- Accent (the ONE accent): #FF5A5F (sunrise coral-red)
- Line/hairline: #2A335E (a lifted tint of the base, 20% steps for
  borders/dividers)
Defense: cobalt-to-coral reads as night-into-sunrise - the literal brand
story - and sits outside all five banned families (chromatic navy, not
graphite; coral-red, not orange/amber/ember or neon cyan; no beige/brass; no
violet). One theme, dark, page-wide; no light-section swap.

## Locked type
Outfit (display - geometric, aerodynamic, carries motion) + IBM Plex Mono
(support - kickers, tags, flight-code-style labels, nav). No serif: this is
a travel-tech utility brand, not heritage/editorial.

## Animation mode

`non-animated` -- user picked "Build non-animated now, free" when the
animated scroll-scrub hero film (~135 credits on Higgsfield) exceeded the
free-tier balance (10 credits available). The brand story (night into dawn)
carries instead through a Tier-1 interactive technique: **wow-catalog C3 --
Scroll-driven mask reveal**, expressed as a plane-window porthole. The page
opens inside a circular porthole mask showing the paper-craft plane against
night-cobalt; scrolling widens the porthole until the hero plate goes
full-bleed and the coral-gold dawn glow fills the frame -- the mask expansion
literally enacts "night giving way to dawn," pairing the technique to the
concept spine. This clears the wow-maker.md craft floor: bespoke generated
assets, a fully-executed interactive Tier-1 mechanic (scroll position drives
mask radius via GSAP ScrollTrigger, not a passive loop), real typography,
reduced-motion static fallback (porthole fully open, no scroll-linked JS).

### Tier-1 technique defense
C3 mask reveal was chosen over B1/D3 because the porthole is a literal object
in the travel world (an airplane window), so the technique is motivated by
the brand's own material vocabulary, not decoration. First build in this
chat -- axes (palette, type pairing, hero architecture "image-as-canvas
porthole", Tier-1 technique C3, CTA garments, corner language: soft
12-16px) are all derived fresh from the brief.

## Section plan (ordered, no consecutive repeats)
1. Hero -- porthole mask reveal (C3), paper-craft plane plate, night-to-dawn
2. Intro value strip - asymmetric split, text left / generated plate right
3. Flights - editorial split, image right, underlined-link CTA
4. Hotels - editorial split inverted, image left, framed-block CTA
5. Car Rentals - asymmetric bento (2 cards, uneven), headline-as-button CTA
6. Airport Services - full-bleed poster band with overlay text, banner CTA
7. Events and Tickets - masonry gallery grid, pill CTA (the one pill on the
   page)
8. SIM and eSIM Cards - horizontal scroll strip of plan chips, chip CTA
9. Tours and Activities - full-bleed gallery + horizontal scroll cards,
   circular icon-button CTA
10. How Skynova works - Swiss 3-step grid, spelled-out steps (no numbering)
11. Trust strip - marquee of generated partner-network marks (Travelpayouts
    network), no eyebrow
12. Traveler quotes - 2 quotes, split testimonial wall
13. Final CTA banner - full-width, particle-burst hover, "Start your trip"
14. Footer - nav recap, verticals recap, legal

4+ distinct layout families present (editorial split x2 variants, bento,
poster band, masonry, horizontal scroll x2, Swiss grid, marquee, testimonial
wall, banner). Eyebrow ration: 14 sections -> ceil(14/3) = 5 eyebrows max
(journey chapters' kickers count toward this; spend the rest sparingly).

## Asset plan
- Hero: the single-shot film (scene-01.mp4 + mobile) + exact-frame posters
  (covers journey hero/content imagery)
- Section plates: 2-3 atmospheric cobalt/coral gradient plates for
  non-photo section backgrounds
- Content imagery (paper-craft world, style-matched to the film): a
  boarding-pass/plane plate (Flights), a paper-craft hotel building
  (Hotels), a paper-craft car (Car Rentals), a paper-craft terminal +
  luggage (Airport Services), paper-craft event tickets (Events & Tickets),
  a paper-craft phone with a signal/SIM card (SIM & eSIM), a paper-craft
  compass + landmark cluster (Tours & Activities)
- Custom icon set: one sheet, 10 glyphs (search, flight, hotel, car,
  luggage/airport, ticket, signal/esim, compass/tour, checkmark, support),
  2px coral stroke on transparent, sliced + background-removed
- Logo/monogram: "Skynova Agency" wordmark + a standalone nova-spark
  monogram (no existing logo supplied)
- OG image + head kit (favicon, apple-touch-icon, maskable icons,
  manifest, theme-color) via the cover pipeline
- Trust-strip marks: 4-6 small generic travel-network glyphs (stylized,
  not real brand logos, since no real partner logos were supplied)

## CTA inventory (one label per intent, each its own component)
- Start your trip - nav pill + hero primary + final banner: same
  intent/label reused across all three placements (per the one-label rule),
  three distinct components: nav = small magnetic pill; hero = large pill
  with a nova-spark hover trail; final banner = full-width bar with a
  particle burst on hover/click.
- See how it works - hero secondary: ghost text link, arrow slides
  right on hover.
- Compare flights - Flights: underlined inline link, arrow travels on
  hover.
- Browse stays - Hotels: framed outline block, coral fill wipes in on
  hover.
- Reserve a car - Car Rentals: the section headline itself is the
  click target, small arrow badge follows the cursor.
- Add airport help - Airport Services: full-width banner bar, coral
  ground, ink text.
- Find events - Events & Tickets: solid coral pill (the page's one
  pill CTA).
- Get connected - SIM & eSIM: chip button, signal-bar icon animates on
  hover.
- Explore tours - Tours & Activities: circular icon button, arrow
  rotates on hover.

## Affiliate model
Travelpayouts-network affiliate links throughout (flights/hotels via
Aviasales/Hotellook-style links, cars via Rentalcars-style, tours via
GetYourGuide/Klook-style, eSIM via Airalo-style, tickets via
Tiqets/GetYourGuide-style) - every outbound CTA points at a clearly
labelled placeholder query param (marker=SKYNOVA_TP_ID) the owner swaps
for their real Travelpayouts marker/sub-IDs per vertical. No fabricated
review counts or performance stats; catalog-style content (route names,
destination names) is fine.
