import React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Input from "../../../atoms/inputs";
import Label from "../../../atoms/label";
import { useToast } from "../../../../hooks/toast/useToast";
import Toast from "../../toast/toast";
import PasswordStrengthMeter from "../../../atoms/passwordCharMeter";
import { Button } from "../../../atoms/Buttons/button";
import { useRouter } from "next/router";
import { useOperatorSignin } from "../../../../hooks/auth/useOperatorSignin";

export default function OperatorSignin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { showToast, message, type, isVisible, hideToast } = useToast();
  const { signIn: signInForm, loading: signupLoading } = useOperatorSignin();

  const router = useRouter();

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
      const res = await signInForm(form);

      if (res.success) {
        showToast("Signin successful! Redirecting…", "success");
        setTimeout(() => router.push("/tours"), 1500);
      } else {
        showToast("Signup failed. Please try again.", "error");
      }
      await signIn("emailPassword", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
    } catch (err: any) {
      console.log("errrrrrrrr:::::::", err);
      showToast("Server error: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
