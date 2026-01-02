import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IshvaraX",
  description: "Decoding human consciousness through Brain-Computer Interfaces and Predictive Artificial Intelligence.",
  keywords: ["IshvaraX", "BCI", "AI", "Neuroscience", "Artificial Intelligence", "Brain-Computer Interface"],
  authors: [{ name: "IshvaraX" }],
  openGraph: {
    title: "IshvaraX",
    description: "Decoding human consciousness through Brain-Computer Interfaces and Predictive Artificial Intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}