// src/components/I18nProvider.tsx
"use client";

import "@/lang/i18n"; // ✅ Import ensures initialization
import { useEffect } from "react";

export default function LangProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
