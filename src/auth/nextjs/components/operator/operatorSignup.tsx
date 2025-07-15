"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Input from "../../../../components/atoms/inputs";
import Label from "../../../../components/atoms/label";
import Checkbox from "../../../../components/atoms/checkbox";
import { validatePassword } from "../../../../utils/validatePassword";
import { validatePhoneNumber } from "../../../../utils/validatePhoneNumber";
import { useToast } from "../../../../hooks/toast/useToast";
import Toast from "../../../../components/molecules/toast/toast";
import { validateImageFile } from "../../../../utils/validateImageFile";
import PasswordStrengthMeter from "../../../../components/atoms/passwordCharMeter";
import BackButton from "../../../../components/atoms/Buttons/BackButton";
import { Button } from "../../../../components/atoms/Buttons/button";
import { saveOperatorData, signUp } from "../../actions";
import { useRouter } from "next/navigation";

const SERVICE_CHECKBOXES = [
  { id: "sailing", label: "Sail tours", checked: false },
  { id: "diving", label: "Diving tours", checked: false },
  { id: "option3", label: "Cenote tours", checked: false },
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
  const [loading, setLoading] = useState(false);

  const { showToast, message, type, isVisible, hideToast } = useToast();
  const router = useRouter();

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

    let logoUrl = "";
    let logoPath = "";
    let logoFilename = "";
    let logoMimeType = "";
    let logoSize = 0;

    try {
      if (form.logo) {
        const file = form.logo;

        if (!(file instanceof File)) {
          console.error("form.logo is not a valid File object.");
          return;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `operators/${fileName}`;

        try {
          const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error returned:", uploadError);
            throw new Error("Image upload failed.");
          }
        } catch (uploadException) {
          console.error("Upload threw an exception:", uploadException);
          throw uploadException;
        }

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        if (urlError) {
          console.error("Public URL fetch failed:", urlError);
          throw urlError;
        }

        logoUrl = publicUrlData.publicUrl;
        logoPath = filePath;
        logoFilename = file.name;
        logoMimeType = file.type;
        logoSize = file.size;
      }

      const res = await signUp({
        name: form.name,
        email: form.email,
        password: form.password,
        terms: form.acceptTerms,
        role: "operator",
      });

      if (typeof res === "object" && res !== null && "userId" in res) {
        await saveOperatorData(res.userId, {
          name: form.name,
          email: form.email,
          phoneNumber: form.phone,
          logoUrl,
          logoPath,
          logoFilename,
          logoMimeType,
          logoSize,
        });
      }
      showToast(
        res ? "Business signed up successfully!" : "Something went wrong.",
        res ? "success" : "error"
      );

      router.refresh();
    } catch (err: any) {
      showToast("Server error: " + err.message, "error");
    } finally {
      setLoading(false);
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
