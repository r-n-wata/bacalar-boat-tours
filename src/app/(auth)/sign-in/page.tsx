"use client";

import React from "react";
import { useState } from "react";
import Signin from "../../../auth/nextjs/components/Signin";
import { Button } from "../../../components/atoms/Buttons/button"; // Reusable button
import BackButton from "@/components/atoms/Buttons/BackButton";

type SignUpOptions = "business" | "client";

export default function SignupPage() {
  const [option, setOption] = useState<SignUpOptions>("client");

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      {/* Position back button in top-right */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton to="/" label="Back to Home" />
      </div>{" "}
      <div className="max-w-3xl w-full space-y-8 py-24">
        {/* ← back to landing */}

        <h1 className="text-3xl font-bold text-center text-cream">Sign in</h1>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-4"></div>

        {/* Form card */}
        <div className="bg-white/90 border border-gray-200 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <Signin />
        </div>
      </div>
    </main>
  );
}
