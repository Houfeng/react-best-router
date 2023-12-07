const themeKey = "rbr://theme";
const defaultTheme = "night";

export function getLocalTheme() {
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
const defaultLanguage = "en";

export function getLocalLanguage() {
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
