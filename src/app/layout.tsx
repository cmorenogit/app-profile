import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
    "Senior Full Stack Engineer with 13+ years of experience. Specializing in AI Agents, TypeScript, microservices, and automation. Currently at Apprecio.",
  keywords: [
    "Full Stack Developer",
    "AI Agents",
    "TypeScript",
    "Node.js",
    "React",
    "Microservices",
    "LLM",
    "Automation",
  ],
  authors: [{ name: "Cesar Moreno" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cesarmoreno.dev",
    title: "Cesar Moreno | Senior Full Stack Engineer",
    description: "Building AI agents that automate complex workflows",
    siteName: "Cesar Moreno",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cesar Moreno | Senior Full Stack Engineer",
    description: "Building AI agents that automate complex workflows",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Cesar Moreno",
  jobTitle: "Senior Full Stack Engineer",
  url: "https://cesarmoreno.dev",
  sameAs: [
    "https://linkedin.com/in/morenodev",
    "https://github.com/cmorenogit",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Apprecio",
  },
  knowsAbout: [
    "TypeScript",
    "JavaScript",
    "AI Agents",
    "Microservices",
    "Node.js",
    "React",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
