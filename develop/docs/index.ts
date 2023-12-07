import { contents_zh } from "./zh";
import { contents_en } from "./en";
import { getLocalLanguage } from "../LocalStore";

export const contents = getLocalLanguage() === "zh" ? contents_zh : contents_en;
