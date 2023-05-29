import React, {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";

import { create } from "tailwind-rn";
import styles from "./styles.json";
import staticStyles from "./staticStyles";
import config from "./tailwind.config";

const generatedStyles = Object.assign(styles, staticStyles);

const { tailwind: _tailwind, getColor: _getColor } = create(generatedStyles);

export type StyleClass =
  | keyof typeof generatedStyles
  | `dark:${keyof typeof generatedStyles}`;

// Pure function
const tailwind = (...classes: StyleClass[]) => _tailwind(classes.join(" "));
// const tailwind = (...classes: string[]) => _tailwind(classes.join(' '));
export default tailwind;

export const getColor = (colors: string) => {
  if (config.theme.extend.colors[colors.split(" ")[0].replace("#", "")]) {
    return _getColor(colors);
  } else {
    return colors;
  }
};

// Apply theme with react context
const TailwindContext = createContext<
  [ColorSchemeName, Dispatch<SetStateAction<ColorSchemeName>>]
>([Appearance.getColorScheme(), () => null]);

const handleThemeClasses = (classes: string, isDarkMode: boolean) => {
  const regExp = isDarkMode ? /dark:/g : /dark:\S+/g;
  return classes.replace(regExp, "").replace(/\s\s/g, " ").trim();
};

const useTailwind = () => {
  const context = useContext(TailwindContext);
  if (!context)
    throw new Error(`useTailwind must be used within a TailwindProvider`);

  const [currentColorScheme, setCurrentColorScheme] = context;
  const isDarkMode = currentColorScheme === "dark";

  return {
    isDarkMode,
    setDarkMode: (isDark: boolean) =>
      setCurrentColorScheme(
        isDark ? ("dark" as ColorSchemeName) : ("light" as ColorSchemeName)
      ),
    tw: (...classes: StyleClass[]) =>
      _tailwind(handleThemeClasses(classes.join(" "), isDarkMode)),
    getColor: (colors: string) =>
      getColor(handleThemeClasses(colors, isDarkMode)),
  };
};

const TailwindProvider = ({ children }: { children: React.ReactNode }) => {
  const contextValue = useState(Appearance.getColorScheme());
  return (
    <TailwindContext.Provider value={contextValue}>
      {children}
    </TailwindContext.Provider>
  );
};

export { TailwindProvider, useTailwind };
