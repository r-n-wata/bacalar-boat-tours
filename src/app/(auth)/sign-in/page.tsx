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
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      {/* Position back button in top-right */}
      {/* ← back to landing */}
      <div className="mt-4">
        <BackButton to="/" label="Back to Home" />
      </div>{" "}
      <div className='flex items-center justify-center'>
      <div className="max-w-3xl w-full space-y-8 ">

        <h1 className="text-3xl font-bold text-center text-cream">Sign in</h1>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-4"></div>

        {/* Form card */}
        <div className="bg-white/90 border border-gray-200 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          <Signin />
        </div>
        </div>
      </div>
    </main>
  );
}
