const themeKey = "rbr://theme";
const defaultTheme = "night";

export function getLocalTheme(): string {
  try {
    return JSON.parse(
      localStorage.getItem(themeKey) || JSON.stringify(defaultTheme),
    );
  } catch {
    return defaultTheme;
  }
}

export function setLocalTheme(name: string) {
  localStorage.setItem(themeKey, JSON.stringify(name));
}

const languageKey = "rbr://language";
const defaultLanguage = navigator.language.includes("zh") ? "zh" : "en";

export function getLocalLanguage(): string {
  try {
    return JSON.parse(
      localStorage.getItem(languageKey) || JSON.stringify(defaultLanguage),
    );
  } catch {
    return defaultLanguage;
  }
}

export function setLocalLanguage(name: string) {
  localStorage.setItem(languageKey, JSON.stringify(name));
}
