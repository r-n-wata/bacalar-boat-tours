import React from "react";
import { useState } from "react";
import Input from "../../../../components/atoms/inputs";
import Label from "../../../../components/atoms/label";
import Checkbox from "../../../../components/atoms/checkbox";
import { validatePassword } from "../../../../utils/validatePassword";
import { validatePhoneNumber } from "../../../../utils/validatePhoneNumber";
import { useToast } from "../../../../hooks/toast/useToast";
import Toast from "../../../../components/molecules/toast/toast";
import PasswordStrengthMeter from "../../../../components/atoms/passwordCharMeter";
import { signUp } from "../../actions";
import { Button } from "../../../../components/atoms/Buttons/button";

export default function ClientSignup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: true,
  });
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { showToast, message, type, isVisible, hideToast } = useToast();
  //const { signUp, loading: signupLoading } = useClientSignup();

  /* helpers */
  const text =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);

    /* validation */
    const pass = validatePassword(form.password, form.confirmPassword);
    if (!pass.isValid) return setFieldError(pass.message);

    const phone = validatePhoneNumber(form.phone);
    if (!phone.isValid) return setFieldError(phone.message);

    if (!form.terms) return setFieldError("Please accept terms.");

    /* send */
    setLoading(true);
    try {
      const res = await signUp(form);
      if (res) {
        showToast("Signup successful! Redirecting…", "success");
        //setTimeout(() => router.push("/tours"), 1500);
      } else {
        showToast("Signup failed. Please try again.", "error");
      }
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
        {/* Full Name */}
        <div className="relative">
          <Label forInput="name" name="Full Name" />
          <Input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={text("name")}
          />
        </div>

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

        {/* Phone (masked) */}
        <div className="relative">
          <Label name="Phone Number" forInput="phone" />
          <Input id="phone" type="text" required onChange={text("phone")} />
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
          <PasswordStrengthMeter password={form.password} />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Label forInput="confirmPassword" name="Confirm Password" />
          <Input
            id="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={text("confirmPassword")}
          />
        </div>

        {/* Terms */}
        <Checkbox
          data={[
            {
              id: "acceptTerms",
              label: "I agree to the terms and conditions",
              checked: form.terms,
            },
          ]}
          onChange={(_, checked) => setForm({ ...form, terms: checked })}
        />

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
          {loading ? "Submitting…" : "Create Account"}
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
