import React, { createContext, useState, useCallback, ReactNode } from "react";

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageContext = createContext<{
  language: string;
  changeLanguage: (lng: string) => void;
}>({
  language: "en",
  changeLanguage: () => {},
});

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<string>("en");

  const changeLanguage = useCallback((lng: string) => {
    setLanguage(lng);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export { LanguageProvider };
export {}; // Add this at the end of the file
