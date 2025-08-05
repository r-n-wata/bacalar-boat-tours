// lang/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en.json";
import es from "./es.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

// ✅ Initialize immediately
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: "en", // Default language
      debug: process.env.NODE_ENV === "development",
      detection: {
        order: ["cookie", "localStorage", "htmlTag", "path", "subdomain"],
        caches: ["cookie", "localStorage"],
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
      },
      interpolation: { escapeValue: false },
      react: { bindI18nStore: "added" },
    });
}

export default i18n;

export const addI18ntranslations = async (
  namespace: string,
  transBundleDict: any
) => {
  let bundlesAdded = 0;

  try {
    if (!i18n.hasLoadedNamespace(namespace)) {
      await i18n.loadNamespaces(namespace);
    }

    const langs = Object.keys(transBundleDict);
    langs.forEach((lang) => {
      if (!i18n.hasResourceBundle(lang, namespace)) {
        i18n.addResourceBundle(lang, namespace, transBundleDict[lang], true);
        bundlesAdded += 1;
      }
    });
  } catch (error) {
    console.log("error loading translations", error);
  } finally {
    return bundlesAdded;
  }
};

export const changeLanguage = (lang: string) => {
  const milliSecondPerYear = 31536000000;
  i18n.changeLanguage(lang);
  const expires = new Date(Date.now() + milliSecondPerYear).toUTCString();
  // ✅ Correct key: i18next
  document.cookie = `i18next=${lang}; expires=${expires}; path=/`;

  // ✅ Also keep this for localStorage detection
  localStorage.setItem("i18nextLng", lang);
};
