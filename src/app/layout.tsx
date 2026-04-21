import type { Metadata } from "next";
import { Outfit, Dela_Gothic_One, Kanit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-cozy",
});

const kanit = Kanit({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-kanit",
});

const delaGothic = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://library-of-souls.vercel.app"),
  title: "Library of Souls | ค้นหาตัวตนผ่านสไตล์นักอ่าน 16 ไทป์",
  description: "ค้นหาความลับที่ซ่อนอยู่ในจิตวิญญาณผ่านหน้ากระดาษที่สะท้อนตัวตนจริงของคุณ ในห้องสมุด Library of Souls โดย Upskill Everyday",
  keywords: ["MBTI", "แบบทดสอบบุคลิกภาพ", "Library of Souls", "นักอ่าน", "Upskill Everyday", "ค้นหาตัวตน", "จิตวิทยา"],
  authors: [{ name: "Upskill Everyday" }],
  openGraph: {
    title: "Library of Souls | ค้นหาตัวตนผ่านสไตล์นักอ่าน",
    description: "ค้นหา Source Code ตัวตนของคุณผ่านสไตล์นักอ่าน 16 ไทป์ ในห้องสมุดแห่งวิญญาณ",
    url: "https://library-of-souls.vercel.app", // Adjust if needed
    siteName: "Library of Souls",
    images: [
      {
        url: "/assets/book_hero.png", // Using the hero book as a fallback OG image
        width: 1200,
        height: 630,
        alt: "Library of Souls Hero",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Library of Souls | ค้นหาตัวตนผ่านสไตล์นักอ่าน",
    description: "ค้นหา Source Code ตัวตนของคุณผ่านสไตล์นักอ่าน 16 ไทป์",
    images: ["/assets/book_hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${outfit.variable} ${delaGothic.variable} ${kanit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
