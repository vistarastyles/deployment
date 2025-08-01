"use client";
import { useEffect, useState, useCallback } from "react";
import { Image, Icons, Link } from "@/components/Shared";
import { useCart } from "@/components/Cart/CartContext";

interface CartItemWithProduct {
  id: string;
  productTitle: string;
  slug: string;
  imageUrl: string;
  selectedSize: string;
  selectedColor: string;
  productSalePrice: number;
  quantity: number;
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: { name: string; email?: string; contact?: string };
  theme?: { color: string };
}

declare global {
  interface Window {
    Razorpay: new (opts: RazorpayOptions) => { open: () => void };
  }
}

export default function CartClient() {
  const { refreshCartCount } = useCart();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/get?ts=${Date.now()}`);
      const data: CartItemWithProduct[] = await res.json();
      setItems(data);
      await refreshCartCount();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [refreshCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (
    itemId: string,
    action: "increment" | "decrement" | "delete"
  ) => {
    const res = await fetch("/api/cart/update-qty", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, action }),
    });
    if (!res.ok) return;
    setItems((prev) =>
      prev
        .filter((i) => (action === "delete" ? i.id !== itemId : true))
        .map((i) =>
          i.id !== itemId || action === "delete"
            ? i
            : {
                ...i,
                quantity:
                  action === "increment"
                    ? i.quantity + 1
                    : Math.max(1, i.quantity - 1),
              }
        )
    );
    await refreshCartCount();
  };

  const totalAmount = items.reduce(
    (s, i) => s + i.productSalePrice * i.quantity,
    0
  );
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Razorpay load failed"));
      document.body.appendChild(s);
    });

  const handleCheckout = async () => {
    if (!items.length) return alert("Cart is empty");
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to create Razorpay order");
      const { orderId, amount, currency } = await res.json();

      await loadRazorpayScript();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount,
        currency,
        order_id: orderId,
        name: "Vistara Styles",
        description: `Order of ${totalItems} items`,
        handler: (resp) =>
          (window.location.href = `/account/order-confirmation?paymentId=${resp.razorpay_payment_id}`),
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: { color: "#F59E0B" },
      };

      new window.Razorpay(options).open();
    } catch (e) {
      console.error(e);
      alert("Unable to initiate payment.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-700 rounded-lg w-48"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-slate-700 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center">
              <Icons.ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Your cart is empty
              </h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Looks like you haven&apos;t added anything to your cart yet.
                Start shopping to fill it up!
              </p>
            </div>
            <Link
              href={"/shop"}
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              <Icons.ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Shopping Cart</h1>
          <p className="text-slate-400">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-200"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link
                    href={`shop/product/${item.slug}`}
                    className="relative w-32 h-32 flex-shrink-0"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.productTitle ?? "Product image"}
                      layout="fill"
                      className="object-cover rounded-xl"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <Link
                        href={`/shop/product/${item.slug}`}
                        className="text-xl font-semibold text-white truncate pr-4"
                      >
                        {item.productTitle}
                      </Link>
                      <button
                        onClick={() => updateQuantity(item.id, "delete")}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Icons.Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Variant Info */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Size:</span>
                        <span className="px-2 py-1 bg-slate-700 text-white text-sm rounded-md font-medium">
                          {item.selectedSize}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Color:</span>
                        <span className="px-2 py-1 bg-slate-700 text-white text-sm rounded-md font-medium">
                          {item.selectedColor}
                        </span>
                      </div>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-white">
                          ₹
                          {(
                            item.productSalePrice * item.quantity
                          ).toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-400">
                          ₹{item.productSalePrice.toLocaleString()} each
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, "decrement")}
                          disabled={item.quantity <= 1}
                          className="p-2 text-white hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icons.Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, "increment")}
                          className="p-2 text-white hover:bg-slate-600 rounded-lg transition-colors"
                        >
                          <Icons.Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax</span>
                  <span className="text-slate-400">Included in price</span>
                </div>
                <div className="h-px bg-slate-700"></div>
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3 w-full flex flex-col">
                {/* <Link
                  href={"/checkout"}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Proceed to Checkout
                </Link> */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className={`w-full ${
                    checkoutLoading
                      ? "bg-yellow-300"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white py-4 rounded-xl font-semibold transition-colors`}
                >
                  {checkoutLoading ? "Processing…" : "Proceed to Checkout"}
                </button>
                <Link
                  href={"/shop"}
                  className="w-full border border-slate-600 text-slate-300 hover:bg-slate-700/50 py-3 rounded-xl font-medium transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="text-sm text-slate-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>7-day return policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
