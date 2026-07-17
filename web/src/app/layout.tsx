import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeScript from "@/components/ThemeScript";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MilestoneWatcher from "@/components/MilestoneWatcher";
import BackgroundDecoration from "@/components/BackgroundDecoration";
import { SITE_NAME } from "@/lib/personalConfig";
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
  title: `${SITE_NAME} — 2027 Placement Hub`,
  description:
    "A personal collection of internships, graduate roles, and job-hunting resources for the 2027 placement season.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <BackgroundDecoration />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MilestoneWatcher />
      </body>
    </html>
  );
}
