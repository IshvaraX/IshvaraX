import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProjectsProvider } from "@/context/ProjectsContext";

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
  description:
    "A community for the upliftment of people who love to code. PINAKA is our separate, independent research side project.",
  icons: {
    icon: "/icon.jpg",
    shortcut: "/icon.jpg",
    apple: "/icon.jpg",
  },
  keywords: [
    "IshvaraX",
    "Coding community",
    "Learn to code",
    "Open collaboration",
    "PINAKA",
    "BCI",
    "AI",
    "Neuroscience",
  ],
  authors: [{ name: "IshvaraX" }],
  openGraph: {
    title: "IshvaraX",
    description:
      "A community for the upliftment of people who love to code. PINAKA is our separate, independent research side project.",
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
        <AuthProvider>
          <ProjectsProvider>{children}</ProjectsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}