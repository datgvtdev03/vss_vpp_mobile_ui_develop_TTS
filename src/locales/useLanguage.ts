import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE } from "src/constants/common";
import { getLanguage } from "src/utils/persist";

const useLanguage = (): void => {
  const { i18n } = useTranslation();
  // Initial load system's settings
  useEffect(() => {
    // load language setting
    getLanguage().then((language) =>
      i18n.changeLanguage(language || DEFAULT_LANGUAGE)
    );
  }, [i18n]);
};

export default useLanguage;
