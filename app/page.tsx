"use client";
import BestSeller from "@/components/Home/BestSeller";
import Featured from "@/components/Home/Featured";
import Header from "@/components/Home/Header";
import NewProducts from "@/components/Home/NewProducts";
import NewsletterSignup from "@/components/Home/Newsletter";
import UpdateLoginStatus from "@/components/update-login";
export default function HomePage() {
  return (
    <main>
      <UpdateLoginStatus />
      <Header />
      <NewProducts />
      <BestSeller />
      <Featured />
      <NewsletterSignup />
    </main>
  );
}
