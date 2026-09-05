import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/auth-context";
import { addWishlistItem, getWishlist, removeWishlistItem, type WishlistItem } from "@/lib/api/wishlist.functions";

// Reused everywhere a destination or vertical is rendered as a card: an
// absolutely-positioned overlay heart when the whole card is itself a
// <Link> (destination cards), or a labeled inline button on a detail
// page's own hero. Signed-out clicks open the shared AuthModal instead of
// silently failing -- the intent (save this) is preserved across sign-in.
export function WishlistButton({
  itemType,
  itemSlug,
  variant = "overlay",
  label,
}: {
  itemType: WishlistItem["itemType"];
  itemSlug: string;
  // "bare" is the same control minus the absolute positioning, for when a
  // parent already places it -- e.g. inside the CardActions pill.
  variant?: "overlay" | "inline" | "bare";
  label?: string;
}) {
  const { user, openAuthModal } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  const isSaved = Boolean(wishlist?.some((i) => i.itemType === itemType && i.itemSlug === itemSlug));

  const addMutation = useMutation({
    mutationFn: () => addWishlistItem({ data: { itemType, itemSlug } }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const prev = queryClient.getQueryData<WishlistItem[]>(["wishlist"]) ?? [];
      queryClient.setQueryData<WishlistItem[]>(["wishlist"], [...prev, { itemType, itemSlug }]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) queryClient.setQueryData(["wishlist"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const removeMutation = useMutation({
    mutationFn: () => removeWishlistItem({ data: { itemType, itemSlug } }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const prev = queryClient.getQueryData<WishlistItem[]>(["wishlist"]) ?? [];
      queryClient.setQueryData<WishlistItem[]>(
        ["wishlist"],
        prev.filter((i) => !(i.itemType === itemType && i.itemSlug === itemSlug)),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx) queryClient.setQueryData(["wishlist"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal("sign-in");
      return;
    }
    if (isSaved) removeMutation.mutate();
    else addMutation.mutate();
  }

  return (
    <button
      type="button"
      className={`wishlist-btn wishlist-btn-${variant}${isSaved ? " is-saved" : ""}`}
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <Heart size={variant === "inline" ? 18 : 16} fill={isSaved ? "currentColor" : "none"} />
      {variant === "inline" ? <span>{label ?? (isSaved ? "Saved" : "Save")}</span> : null}
    </button>
  );
}
