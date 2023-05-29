import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./vi";
import en from "./en";

const resources = {
  vi,
  en,
};

i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: ["en", "vi"],
  keySeparator: false,
});

export type i18nKey = keyof typeof vi.common;

export default i18n;
