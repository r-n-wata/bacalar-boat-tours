"use client";

import React, { useState } from "react";
import Input from "../../../atoms/inputs";
import Label from "../../../atoms/label";
import Checkbox from "../../../atoms/checkbox";
import { useOperatorSignup } from "../../../../hooks/auth/useOperatorSignup";
import { validatePassword } from "../../../../utils/validatePassword";
import { validatePhoneNumber } from "../../../../utils/validatePhoneNumber";
import { useToast } from "../../../../hooks/toast/useToast";
import Toast from "../../toast/toast";
import { validateImageFile } from "../../../../utils/validateImageFile";
import PasswordStrengthMeter from "../../../atoms/passwordCharMeter";
import BackButton from "../../../atoms/Buttons/backButton";
import { Button } from "../../../atoms/Buttons/button";
import { signIn } from "next-auth/react";

const SERVICE_CHECKBOXES = [
  { id: "sailing", label: "Sail tours" },
  { id: "diving", label: "Diving tours" },
  { id: "option3", label: "Cenote tours" },
];

export default function OperatorSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    services: {
      sailing: false,
      diving: false,
      option3: false,
    },
    logo: null as File | null,
  });

  const { signUp, loading } = useOperatorSignup();
  const { showToast, message, type, isVisible, hideToast } = useToast();

  /* ---------- Handlers ---------- */
  const handleText =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleServiceToggle = (id: string, checked: boolean) =>
    setForm({ ...form, services: { ...form.services, [id]: checked } });

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, logo: e.target.files?.[0] ?? null });

  /* ---------- Submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passCheck = validatePassword(form.password, form.confirmPassword);
    if (!passCheck.isValid) return showToast(passCheck.message!, "error");

    const phoneCheck = validatePhoneNumber(form.phone);
    if (!phoneCheck.isValid) return showToast(phoneCheck.message!, "error");

    const imgCheck = validateImageFile(form.logo);
    if (!imgCheck.isValid) return showToast(imgCheck.message!, "error");

    /* Build FormData */
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === "services") {
        Object.entries(v as Record<string, boolean>).forEach(([s, val]) =>
          fd.append(`services[${s}]`, String(val))
        );
      } else if (k === "logo" && v) fd.append("logo", v as File);
      else if (typeof v !== "object") fd.append(k, String(v));
    });

    try {
      const res = await signUp(fd);
      showToast(
        res.success
          ? "Business signed up successfully!"
          : "Something went wrong.",
        res.success ? "success" : "error"
      );
      await signIn("emailPassword", {
        redirect: false,
        email: form.email,
        password: form.password,
      });
    } catch (err: any) {
      showToast("Server error: " + err.message, "error");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* NAME & EMAIL */}
        <div className="space-y-6">
          <div className="relative">
            <Label name="Business Name" forInput="name" />
            <Input
              id="name"
              type="text"
              required
              onChange={handleText("name")}
              value={form.name}
            />
          </div>
          <div className="relative">
            <Label name="Business Email" forInput="email" />
            <Input
              id="email"
              type="email"
              required
              onChange={handleText("email")}
              value={form.email}
            />
          </div>
        </div>

        {/* PHONE + PASSWORD */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <Label name="Phone Number" forInput="phone" />
            <Input
              id="phone"
              type="text"
              required
              onChange={handleText("phone")}
            />
          </div>
          <div className="relative">
            <Label name="Password" forInput="password" />
            <Input
              id="password"
              type="password"
              required
              onChange={handleText("password")}
            />
            <PasswordStrengthMeter password={form.password} />
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <Label name="Repeat Password" forInput="confirmPassword" />
          <Input
            id="confirmPassword"
            type="password"
            required
            onChange={handleText("confirmPassword")}
            value={form.confirmPassword}
          />
        </div>

        {/* LOGO + SERVICES */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <Label name="Business Logo" forInput="logo" />
            <Input id="logo" type="file" required onChange={handleLogo} />
          </div>

          {/* Services checkboxes */}
          <div>
            <Label name="Services Offered" forInput="" />
            <Checkbox
              data={SERVICE_CHECKBOXES}
              onChange={handleServiceToggle}
            />
          </div>
        </div>

        {/* ACCEPT TERMS */}
        <div className="relative">
          <Checkbox
            data={[
              {
                id: "acceptTerms",
                label: "I agree to the terms and conditions",
                checked: form.acceptTerms,
              },
            ]}
            onChange={(_, checked) =>
              setForm({ ...form, acceptTerms: checked })
            }
          />
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700"
        >
          {loading ? "Submitting…" : "Create Account"}
        </Button>
      </form>

      {/* TOAST */}
      <Toast
        message={message}
        type={type}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </>
  );
}
