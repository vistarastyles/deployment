"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UpdateLoginStatus() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/user/update-login", {
        method: "POST",
      });
    }
  }, [isSignedIn]);

  return null;
}
