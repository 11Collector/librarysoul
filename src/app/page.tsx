"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Book, Compass, Sparkles, Wind, Cloud } from "lucide-react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-20 bg-ghibli-cream">
      {/* Layered Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-ghibli-sky/40 rounded-full opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-ghibli-leaf/20 rounded-full opacity-40 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-ghibli-sunset/30 rounded-full opacity-30 blur-2xl" />
      </div>

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[10%] opacity-30 hidden md:block"
      >
        <Cloud size={120} className="text-ghibli-green/40" />
      </motion.div>

      {/* Leaf Particles - Client Side Only */}
      {mounted && [...Array(6)].map((_, i) => (
        <Particle key={i} index={i} />
      ))}

      <div className="z-10 text-center max-w-4xl px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="inline-block px-6 py-2 bg-ghibli-green/10 rounded-full mb-8 backdrop-blur-sm border border-ghibli-green/20">
            <p className="font-kanit text-ghibli-green font-medium tracking-widest text-sm uppercase">
              ✨ UPSKILL EVERYDAY PRESENTS ✨
            </p>
          </div>

          {/* Magical Book Hero Illustration - Relocated Below Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: [0, -10, 0],
              scale: 1
            }}
            transition={{ 
              opacity: { duration: 1.2 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 1.2 }
            }}
            className="mb-8 relative"
          >
            <div className="relative z-10 w-[240px] h-[240px] md:w-[320px] md:h-[320px] drop-shadow-[0_25px_50px_rgba(45,90,39,0.3)]">
              <Image 
                src="/assets/book_hero.png" 
                alt="Magical Library of Souls Book"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-ghibli-sunset/20 blur-[60px] rounded-full scale-75 animate-pulse" />
          </motion.div>

          <h1 className="text-6xl md:text-9xl font-pixel text-ghibli-green mb-8 leading-[1.1] relative">
            Library of <br />
            <span className="text-ghibli-wood italic relative">
              Souls
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-8 text-ghibli-sunset"
              >
                <Sparkles size={40} />
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-xl md:text-3xl text-ghibli-ink/80 mb-16 font-classic leading-relaxed max-w-2xl mx-auto italic"
        >
          "ค้นหาความลับที่ซ่อนอยู่ในจิตวิญญาณผ่านหน้ากระดาษที่สะท้อนตัวตนจริงของคุณ"
        </motion.p>

        <div className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <Link
              href="/quiz"
              className="ghibli-button group text-2xl md:text-3xl py-8 px-16 shadow-2xl relative overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <span className="flex items-center gap-6 relative z-10">
                <Compass className="group-hover:rotate-180 transition-transform duration-500" size={32} />
                เริ่มต้นการเดินทาง
                <Wind className="group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Stats Floor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.5 }}
          className="mt-24 pt-12 border-t border-ghibli-green/10 flex flex-wrap justify-center gap-8 md:gap-20 text-ghibli-green/70"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white/50 rounded-2xl shadow-inner">
              <span className="font-pixel text-4xl">20</span>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase font-kanit">Ancient Questions</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white/50 rounded-2xl shadow-inner">
              <span className="font-pixel text-4xl">16</span>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase font-kanit">Soul Archetypes</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white/50 rounded-2xl shadow-inner">
              <span className="font-pixel text-4xl">1</span>
            </div>
            <span className="text-sm font-bold tracking-widest uppercase font-kanit">True Destiny</span>
          </div>
        </motion.div>
      </div>

      {/* Atmospheric Grass Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ghibli-green/20 to-transparent pointer-events-none" />
    </main>
  );
}

// Particle helper to avoid hydration mismatch
function Particle({ index }: { index: number }) {
  const [coords, setCoords] = useState<{ x: number; size: number } | null>(null);

  useEffect(() => {
    setCoords({
      x: Math.random() * 100,
      size: 24 + Math.random() * 20
    });
  }, []);

  if (!coords) return null;

  return (
    <motion.div
      initial={{ x: `${coords.x}%`, y: -100, opacity: 0 }}
      animate={{
        y: 1000,
        x: [`${coords.x}%`, `${coords.x + 5}%`, `${coords.x - 5}%`, `${coords.x}%`],
        opacity: [0, 1, 1, 0],
        rotate: 360
      }}
      transition={{
        duration: 10 + (index * 2),
        repeat: Infinity,
        delay: index * 1.5,
        ease: "linear"
      }}
      className="absolute z-10 text-ghibli-leaf/40 pointer-events-none"
    >
      <GhibliLeaf size={coords.size} />
    </motion.div>
  );
}

// Simple Leaf component for decoration
function GhibliLeaf({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1.8 9.3Z" />
      <path d="M14 15c-1-1-2-1-3-2" />
      <path d="M17 12c-1.5-1-1.5-1.5-3-2" />
    </svg>
  );
}
