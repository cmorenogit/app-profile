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
  title: "Cesar Moreno | Senior Full Stack Engineer",
  description:
    "Senior Full Stack Engineer with 13+ years of experience. Specializing in AI Agents, TypeScript, microservices, and automation.",
  keywords: [
    "Full Stack Developer",
    "AI Agents",
    "TypeScript",
    "Node.js",
    "React",
    "Microservices",
  ],
  authors: [{ name: "Cesar Moreno" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
