"use client";

import React from "react";
import { useState } from "react";
import OperatorSignup from "../../../auth/nextjs/components/operator/operatorSignup";
import ClientSignup from "@/auth/nextjs/components/client/clientSignup";
import { Button } from "../../../components/atoms/Buttons/button"; // Reusable button
import BackButton from "../../../components/atoms/Buttons/BackButton";

type SignUpOptions = "business" | "client";

export default function SignupPage() {
  const [option, setOption] = useState<SignUpOptions>("client");

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 mt-4"
      style={{ backgroundImage: "url('/images/background1.jpg')" }}
    >
      {/* Position back button in top-right */}
      {/* ← back to landing */}
      <div className="flex flex-col items-center justify-center ">
      <div className="max-w-3xl w-full space-y-8">

        <h1 className="text-3xl font-bold text-center text-cream">
          Create an Account
        </h1>

        {/* Toggle buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant={option === "client" ? "primary" : "secondary"}
            onClick={() => setOption("client")}
          >
            I'm a Client
          </Button>
          <Button
            variant={option === "business" ? "primary" : "secondary"}
            onClick={() => setOption("business")}
          >
            I'm a Boat Company
          </Button>
        </div>

        {/* Form card */}
        <div className="bg-white/90 border border-gray-200 rounded-xl p-8 shadow-lg backdrop-blur-sm">
          {option === "business" ? <OperatorSignup /> : <ClientSignup />}
        </div>
        </div>
      </div>
    </main>
  );
}
