"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return regex.test(email.trim());
};

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (error: unknown) {
      const err = error as { message: string };
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4 py-16 bg-black text-white border-t border-b border-gray-800">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Stay in the loop</h2>
        <p className="mt-2 text-gray-400 text-sm">
          Subscribe for exclusive deals, new drops & weekly updates.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex flex-col md:flex-row items-center gap-3"
        >
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white border border-gray-700 focus:outline-none sm:w-60 md:w-40 lg:w-80"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-white font-semibold hover:opacity-80 transition disabled:opacity-50 cursor-pointer w-full md:w-auto"
          >
            <Mail size={17} />
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
