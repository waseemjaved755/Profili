import type { Metadata } from "next";
import { Atmosphere } from "@/components/ui/atmosphere";
import { fontClassName } from "@/lib/fonts";
import { SessionProvider } from "@/lib/session";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Profili",
  description:
    "Turn your technical resume into an autonomous voice agent. Recruiters get direct answers to architecture, stack choices, and past impact in seconds.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

const themeBoot = `(function(){try{var t=localStorage.getItem("profili-theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}else{document.documentElement.style.colorScheme="light"}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontClassName} antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="min-h-dvh bg-background text-foreground">
        <ThemeProvider>
          <Atmosphere />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
