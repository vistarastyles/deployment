// "use client";
// import React, { useState } from "react";
// import {
//   ShieldCheck,
//   CreditCard,
//   Truck,
//   ArrowLeft,
//   Lock,
//   CheckCircle,
// } from "lucide-react";
// import { Image } from "@/components/Shared";

// const CheckoutPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     address: "",
//     apartment: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     phone: "",
//     paymentMethod: "razorpay",
//   });

//   const [step, setStep] = useState(1);

//   // Sample cart items for display
//   const cartItems = [
//     {
//       id: 1,
//       name: "Premium Cotton T-Shirt",
//       size: "L",
//       color: "Black",
//       price: 1299,
//       quantity: 2,
//       image:
//         "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&h=150&fit=crop",
//     },
//     {
//       id: 2,
//       name: "Denim Jacket",
//       size: "M",
//       color: "Blue",
//       price: 2499,
//       quantity: 1,
//       image:
//         "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=150&h=150&fit=crop",
//     },
//   ];

//   const subtotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setStep(3);
//   };

//   if (step === 3) {
//     return (
//       <div className="min-h-screen bg-black">
//         <div className="max-w-2xl mx-auto px-4 py-16">
//           <div className="text-center space-y-6">
//             <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center">
//               <CheckCircle className="w-12 h-12 text-white" />
//             </div>
//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold text-white">
//                 Order Confirmed!
//               </h1>
//               <p className="text-gray-400">
//                 Thank you for your purchase. Your order #12345 has been placed
//                 successfully.
//               </p>
//             </div>
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <h3 className="text-lg font-semibold text-white mb-4">
//                 Order Details
//               </h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between text-gray-300">
//                   <span>Order Number:</span>
//                   <span className="text-white">#12345</span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Total Amount:</span>
//                   <span className="text-white">
//                     ₹{subtotal.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Delivery:</span>
//                   <span className="text-green-400">3-5 business days</span>
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={() => (window.location.href = "/")}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <h1 className="text-3xl font-bold text-white">Checkout</h1>
//             <p className="text-gray-400">Complete your purchase</p>
//           </div>
//         </div>

//         {/* Progress Steps */}
//         <div className="flex items-center justify-center mb-12">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
//                   step >= 1
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-800 text-gray-400"
//                 }`}
//               >
//                 1
//               </div>
//               <span className="ml-2 text-white">Information</span>
//             </div>
//             <div
//               className={`w-16 h-px ${
//                 step >= 2 ? "bg-blue-600" : "bg-gray-700"
//               }`}
//             ></div>
//             <div className="flex items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
//                   step >= 2
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-800 text-gray-400"
//                 }`}
//               >
//                 2
//               </div>
//               <span className="ml-2 text-white">Payment</span>
//             </div>
//           </div>
//         </div>

//         <div className="lg:grid lg:grid-cols-2 lg:gap-12">
//           {/* Left Side - Forms */}
//           <div className="space-y-8">
//             {/* Contact Information */}
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
//                   1
//                 </div>
//                 Contact Information
//               </h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Email address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="your@email.com"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//                 <Truck className="w-5 h-5" />
//                 Shipping Address
//               </h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     First name
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="John"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Last name
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Doe"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Address
//                   </label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="123 Main Street"
//                   />
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Apartment, suite, etc. (optional)
//                   </label>
//                   <input
//                     type="text"
//                     name="apartment"
//                     value={formData.apartment}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Apartment 4B"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     City
//                   </label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Mumbai"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     State
//                   </label>
//                   <input
//                     type="text"
//                     name="state"
//                     value={formData.state}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Maharashtra"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Postal code
//                   </label>
//                   <input
//                     type="text"
//                     name="postalCode"
//                     value={formData.postalCode}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="400001"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="+91 98765 43210"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method Selection */}
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
//               <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//                 <CreditCard className="w-5 h-5" />
//                 Payment Method
//               </h2>

//               <div className="space-y-4">
//                 {/* Razorpay Option */}
//                 <label className="flex items-center gap-4 p-4 border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="razorpay"
//                     checked={formData.paymentMethod === "razorpay"}
//                     onChange={handleInputChange}
//                     className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
//                   />
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
//                       <CreditCard className="w-5 h-5 text-white" />
//                     </div>
//                     <div>
//                       <div className="text-white font-medium">
//                         Online Payment
//                       </div>
//                       <div className="text-sm text-gray-400">
//                         Pay securely with Razorpay (Cards, UPI, Net Banking)
//                       </div>
//                     </div>
//                   </div>
//                 </label>

//                 {/* Cash on Delivery Option */}
//                 <label className="flex items-center gap-4 p-4 border border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value="cod"
//                     checked={formData.paymentMethod === "cod"}
//                     onChange={handleInputChange}
//                     className="w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 focus:ring-blue-500"
//                   />
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
//                       <span className="text-white font-bold text-sm">₹</span>
//                     </div>
//                     <div>
//                       <div className="text-white font-medium">
//                         Cash on Delivery
//                       </div>
//                       <div className="text-sm text-gray-400">
//                         Pay when you receive your order
//                       </div>
//                     </div>
//                   </div>
//                 </label>
//               </div>

//               {formData.paymentMethod === "cod" && (
//                 <div className="mt-4 p-4 bg-amber-900/20 border border-amber-800 rounded-xl">
//                   <div className="flex items-center gap-2 text-amber-400 text-sm">
//                     <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
//                     <span>Please keep exact change ready for delivery</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Side - Order Summary */}
//           <div className="mt-8 lg:mt-0">
//             <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-8">
//               <h2 className="text-xl font-bold text-white mb-6">
//                 Order Summary
//               </h2>

//               {/* Cart Items */}
//               <div className="space-y-4 mb-6">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="flex gap-4">
//                     <div className="relative w-16 h-16 flex-shrink-0">
//                       <Image
//                         src={item.image}
//                         alt={item.name}
//                         className="w-full h-full object-cover rounded-lg"
//                         width={100}
//                         height={100}
//                       />
//                       <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
//                         {item.quantity}
//                       </span>
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="text-white font-medium">{item.name}</h4>
//                       <p className="text-sm text-gray-400">
//                         Size: {item.size} • Color: {item.color}
//                       </p>
//                       <p className="text-sm text-white font-semibold">
//                         ₹{(item.price * item.quantity).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pricing */}
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between text-gray-300">
//                   <span>Subtotal</span>
//                   <span>₹{subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Shipping</span>
//                   <span className="text-green-400">Free</span>
//                 </div>
//                 <div className="flex justify-between text-gray-300">
//                   <span>Tax</span>
//                   <span className="text-gray-400">Included</span>
//                 </div>
//                 <div className="h-px bg-gray-700"></div>
//                 <div className="flex justify-between text-xl font-bold text-white">
//                   <span>Total</span>
//                   <span>₹{subtotal.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Complete Order Button */}
//               <button
//                 onClick={handleSubmit}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
//               >
//                 {formData.paymentMethod === "razorpay" ? (
//                   <>
//                     <Lock className="w-5 h-5" />
//                     Proceed to Payment
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Place Order
//                   </>
//                 )}
//               </button>

//               {/* Security Badge */}
//               <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
//                 <ShieldCheck className="w-4 h-4 text-green-400" />
//                 {formData.paymentMethod === "razorpay"
//                   ? "Secure payment powered by Razorpay"
//                   : "Your order information is secure and encrypted"}
//               </div>

//               {/* Trust Badges */}
//               <div className="mt-6 pt-6 border-t border-gray-800">
//                 <div className="text-sm text-gray-400 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                     <span>Free shipping on all orders</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                     <span>7-day return policy</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                     <span>24/7 customer support</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
