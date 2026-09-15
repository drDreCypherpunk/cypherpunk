import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--jetbrains-mono",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--plex-sans",
  display: "swap",
});

export const metadata = {
  title: "CYPHERPUNK App",
  description: "Bitcoin-Native. Decentralised by Design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} ${plexSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
