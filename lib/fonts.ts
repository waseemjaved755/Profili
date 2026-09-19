import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

/**
 * Product typefaces. Change the constructors below to restyle the app.
 * Screens already use `font-sans`, `font-heading`, and `font-mono`.
 */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-src",
});

const heading = sans;

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  variable: "--font-mono-src",
});

export const fontClassName = [
  sans.variable,
  heading !== sans ? heading.variable : "",
  mono.variable,
]
  .filter(Boolean)
  .join(" ");
