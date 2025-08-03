// File: /app/account/order-confirmation/[paymentId]/page.tsx

import { notFound } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

interface Props {
  params: {
    paymentId: string;
  };
}

// JSON column type for order items
type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export default async function OrderConfirmation({ params }: Props) {
  const { paymentId } = await Promise.resolve(params);

  if (!paymentId) return notFound();

  // Fetch the order record
  const [order] = await db
    .select({
      id: orders.id,
      razorpayOrderId: orders.razorpayOrderId,
      paymentId: orders.paymentId,
      paymentStatus: orders.paymentStatus,
      invoiceUrl: orders.invoiceUrl,
      amount: orders.amount,
      items: orders.items,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.paymentId, paymentId));

  if (!order) return notFound();

  const items = order.items as OrderItem[];

  // Calculate estimated delivery date (5-7 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 6);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-slate-400">
            Your order has been successfully placed and payment received
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Order Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Order Number:</span>
                    <span className="text-white font-semibold">
                      {order.razorpayOrderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment ID:</span>
                    <code className="text-blue-400 bg-slate-900 px-3 py-1 rounded-lg text-sm font-mono">
                      {order.paymentId}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Amount:</span>
                    <span className="text-white font-bold text-xl">
                      ₹
                      {parseInt(order.amount.toLocaleString()).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {order.invoiceUrl ? (
                <Link
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener"
                  download
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 bg-gray-600 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  Invoice Pending
                </button>
              )}
            </div>

            {/* Right Column - Delivery Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-blue-400" />
                  Delivery Information
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-white font-semibold">
                        Estimated Delivery
                      </span>
                    </div>
                    <p className="text-slate-300 text-lg">
                      {formattedDeliveryDate}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      5-7 business days
                    </p>
                  </div>

                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">
                        Free Shipping
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Your order qualifies for free delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-slate-800/50 p-6 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Items</h3>
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-slate-300 mb-2"
            >
              <div>
                {item.title} × {item.quantity}
                <span className="text-slate-400">
                  ({item.selectedSize}, {item.selectedColor})
                </span>
              </div>
              <div>₹{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Order Timeline */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Order Timeline</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold">Order Confirmed</div>
                <div className="text-slate-400 text-sm">Just now</div>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-60">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="text-slate-300 font-semibold">
                  Preparing for Shipment
                </div>
                <div className="text-slate-500 text-sm">Within 24 hours</div>
              </div>
            </div>

            <div className="flex items-center gap-4 opacity-40">
              <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex-1">
                <div className="text-slate-400 font-semibold">
                  Out for Delivery
                </div>
                <div className="text-slate-500 text-sm">5-7 business days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">
            What&apos;s Next?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="text-white font-semibold">Track Your Order</h4>
                  <p className="text-slate-400 text-sm">
                    You&apos;ll receive tracking information via email and SMS
                    once your order ships.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    Prepare for Delivery
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Make sure someone is available to receive the package at
                    your delivery address.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="text-white font-semibold">Need Help?</h4>
                  <p className="text-slate-400 text-sm">
                    Contact our customer support team if you have any questions
                    about your order.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="text-white font-semibold">Easy Returns</h4>
                  <p className="text-slate-400 text-sm">
                    7-day return policy. Contact us if you&apos;re not
                    completely satisfied.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <p className="text-slate-300 text-lg">Want to shop more?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 hover:bg-slate-700/50 px-8 py-3 rounded-xl font-medium transition-colors">
              View Order History
            </button>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-12 text-center">
          <div className="bg-slate-900/50 rounded-xl p-6 inline-block">
            <h4 className="text-white font-semibold mb-2">Need Assistance?</h4>
            <p className="text-slate-400 text-sm mb-3">
              Our customer support team is here to help
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-blue-400">support@yourstore.com</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
