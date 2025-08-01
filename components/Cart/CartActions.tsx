"use client";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/Shared";

interface CartActionsProps {
  item: CartItemWithProduct;
}

export default function CartActions({ item }: CartActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const updateQuantity = (newQty: number) => {
    if (newQty < 1) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/cart/update-qty", {
          method: "POST",
          body: JSON.stringify({
            cartItemId: item.id,
            quantity: newQty,
          }),
        });

        if (!res.ok) throw new Error();

        router.refresh();
      } catch (err) {
        alert(`${err}, "Failed to update quantity"`);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="outline"
        onClick={() => updateQuantity(item.quantity - 1)}
        disabled={isPending || item.quantity === 1}
      >
        <Icons.Minus className="w-4 h-4" />
      </Button>
      <span className="w-6 text-center">{item.quantity}</span>
      <Button
        size="icon"
        variant="outline"
        onClick={() => updateQuantity(item.quantity + 1)}
        disabled={isPending}
      >
        <Icons.Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
