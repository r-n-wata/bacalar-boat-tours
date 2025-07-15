"use client";
import React from "react";
import { useState } from "react";

import Input from "../../../components/atoms/inputs";
import Label from "../../../components/atoms/label";
import { useToast } from "../../../hooks/toast/useToast";
import Toast from "../../../components/molecules/toast/toast";
import PasswordStrengthMeter from "../../../components/atoms/passwordCharMeter";
import { Button } from "../../../components/atoms/Buttons/button";
import { signIn } from "../actions";
import { useRouter } from "next/navigation";
//import { useRouter } from "next/router";

export default function ClientSignin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { showToast, message, type, isVisible, hideToast } = useToast();

  const router = useRouter();

  //const router = useRouter();

  /* helpers */
  const text =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    /* send */
    setLoading(true);
    try {
      const res = await signIn(form);

      if (res.error) {
        showToast("Signup failed. " + res.error, "error");
        return;
      }
      showToast("Signin successful! Redirecting…", "success");
      setTimeout(() => {
        window.location.href = "/tours";
      }, 200);

      // setTimeout(() => router.push("/tours"), 1500);
    } catch (err: any) {
      showToast("Server error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Button type="button" variant="secondary">
        Sign up with Google
      </Button>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative">
          <Label forInput="email" name="Email" />
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={text("email")}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Label forInput="password" name="Password" />
          <Input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={text("password")}
          />
        </div>

        {/* Inline field error */}
        {fieldError && (
          <p className="text-red-600 text-sm -mt-4">{fieldError}</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full py-3 font-semibold transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Sign in"}
        </Button>
      </form>
      <Toast
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </>
  );
}
