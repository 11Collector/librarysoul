"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { results, ResultType } from "@/data/results";
import { Share2, RefreshCw, Home, Sparkles, Wand2, BookOpen, Wind, Star, Download, Eye, AlertCircle, Zap } from "lucide-react";
import { toPng } from "html-to-image";
import Image from "next/image";

export default function ResultPage() {
  const { resultId } = useParams();
  const [resultData, setResultData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!resultId) return;

      // Handle local fallback
      if (resultId === 'local') {
        const localData = localStorage.getItem('library_of_souls_latest');
        if (localData) {
          setResultData(JSON.parse(localData));
        } else {
          router.push("/");
        }
        setLoading(false);
        return;
      }

      // Handle Firestore fetch
      try {
        const docRef = doc(db, "assessment_results", resultId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setResultData(docSnap.data());
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching Firestore result:", error);
        router.push("/");
      }
      setLoading(false);
    }
    fetchData();
  }, [resultId, router]);

  const handleDownloadImage = async () => {
    if (cardRef.current === null) return;
    setIsExporting(true);
    
    try {
      // 1. Wait for all animations to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const element = cardRef.current;
      
      // 2. Perform the export with professional "Safe Zone" configuration
      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: '#fdfcf0',
        style: {
          transform: 'scale(1)',
          borderRadius: '0',
          backdropFilter: 'none',
          margin: '0',
          padding: '24px 60px 180px 60px', // Reduced top, massive bottom for horizon
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: '#fdfcf0'
        },
        pixelRatio: 3, 
        skipFonts: false,
      });

      // 3. Trigger download
      const link = document.createElement('a');
      const safeTitle = soulType.title.replace(/\s+/g, '-').toLowerCase();
      link.download = `library-of-souls-${safeTitle}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Image export failed:', err);
      try {
         const dataUrl = await toPng(cardRef.current, { backgroundColor: '#fdfcf0', pixelRatio: 2, skipFonts: true });
         const link = document.createElement('a');
         link.download = `library-of-souls-result.png`;
         link.href = dataUrl;
         link.click();
      } catch (retryErr) {
         alert('ขออภัย! ระบบบันทึกรูปขัดข้อง กรุณาใช้การแคปหน้าจอแทนนะครับ');
      }
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ghibli-cream flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={80} className="text-ghibli-green" />
        </motion.div>
      </div>
    );
  }

  const soulType: ResultType = results[resultData?.mbtiType] || results["ISFJ"];

  return (
    <main className="min-h-screen bg-ghibli-cream p-4 md:p-12 flex flex-col items-center relative overflow-hidden">
      {/* Atmosphere Layers */}
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-ghibli-sky/30 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-ghibli-sunset/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl w-full z-10"
      >
        {/* Results Header Nav */}
        <div className="flex justify-between items-center mb-16 px-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/')}
            className="p-3 bg-white/40 backdrop-blur-sm rounded-full text-ghibli-green shadow-sm border border-white/40"
          >
            <Home size={24} />
          </motion.button>
          <div className="bg-ghibli-green/10 px-6 py-2 rounded-full border border-ghibli-green/20 backdrop-blur-sm">
            <span className="font-kanit text-[10px] tracking-widest text-ghibli-green uppercase font-bold">Scroll Deciphered</span>
          </div>
          <div className="w-12 h-12 bg-ghibli-sunset/40 rounded-2xl animate-float-soft flex items-center justify-center">
            <Star size={20} className="text-ghibli-wood" />
          </div>
        </div>

        {/* Capture Wrapper - Simplified as logo is now inside */}
        <div id="result-card" ref={cardRef} className="relative w-full flex flex-col items-center">
          {/* Main Result Card */}
          <div
            className="ghibli-card relative overflow-visible pt-12 pb-16 px-6 md:px-16 text-center"
          >
            {/* Logo Now Inside the Card - Centered and Secure */}
            <div className="flex justify-center mb-8">
              <div className="p-5 bg-ghibli-green text-white rounded-2xl shadow-xl transition-transform hover:scale-110">
                <BookOpen size={40} />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col items-center mb-10">
                <div className="h-[1px] w-12 bg-ghibli-green/20 mb-4" />
                <p className="font-kanit text-ghibli-wood/60 tracking-[0.4em] text-[10px] uppercase font-bold">
                  Spirit Identity Decoded
                </p>
              </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-block px-4 py-1 bg-ghibli-green/5 rounded-lg mb-4">
                <h2 className="text-sm font-kanit font-bold text-ghibli-green/40 tracking-widest uppercase">
                  CLASS: {resultData?.mbtiType}
                </h2>
              </div>
              <h1 className="text-4xl md:text-7xl font-kanit font-bold text-ghibli-green mb-10 leading-tight">
                {soulType.title}
              </h1>
            </motion.div>

            {/* Illustration Area - Enhanced Magical Vibe */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", damping: 15 }}
              className="relative mb-16 group"
            >
              {/* Magical Sunburst Glow */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-[300px] h-[300px] bg-gradient-to-r from-ghibli-sunset/20 via-ghibli-sky/20 to-ghibli-leaf/20 rounded-full blur-[60px] opacity-60"
                />
                <div className="absolute w-[250px] h-[250px] bg-white opacity-40 rounded-full blur-[40px]" />
              </div>

              <div className="w-full min-h-[400px] md:min-h-[600px] flex items-center justify-center relative py-10">
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [-3, 3, -3],
                    scale: [1, 1.03, 1]
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative w-[320px] h-[400px] md:w-[550px] md:h-[680px] z-10"
                >
                  <Image
                    src={soulType.bookImage}
                    alt={soulType.title}
                    fill
                    className="object-contain filter drop-shadow-[0_20px_60px_rgba(45,90,39,0.4)]"
                    priority
                  />
                </motion.div>

                {/* Floating Magical Orbs */}
                <motion.div animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-0 right-10 text-ghibli-sunset"><Sparkles size={48} /></motion.div>
                <motion.div animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-10 left-10 text-ghibli-leaf"><Wind size={56} /></motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0, 1, 0],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                  className="absolute top-20 left-20 text-ghibli-sky/40"
                >
                  <Sparkles size={24} />
                </motion.div>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-10 py-4 rounded-2xl shadow-xl border border-ghibli-green/10 z-20">
                <span className="font-kanit italic text-xl text-ghibli-wood whitespace-nowrap">
                  "{soulType.vibe}"
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-left bg-ghibli-cream/40 p-8 md:p-12 rounded-[2rem] border border-white/60 shadow-inner relative mb-12"
            >
              <div className="absolute -top-4 left-8 bg-white px-4 py-1 rounded-full border border-ghibli-green/20 shadow-sm">
                <h3 className="font-kanit font-bold text-[10px] text-ghibli-wood tracking-widest uppercase">Soul Fragment</h3>
              </div>
              <p className="text-xl md:text-2xl font-kanit font-semibold text-ghibli-ink leading-relaxed italic text-center md:text-left">
                {soulType.description}
              </p>
            </motion.div>

            {/* Analytical Columns */}
            <div className="space-y-8 mt-12 text-left">
              {/* Insight Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-ghibli-green/[0.08] border border-ghibli-green/20 rounded-2xl p-6 md:p-8 flex items-start gap-4 hover:bg-ghibli-green/[0.12] transition-colors group shadow-sm"
              >
                <div className="p-3 bg-ghibli-green text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <Eye size={24} />
                </div>
                <div>
                  <h3 className="font-kanit font-bold text-ghibli-green text-sm tracking-widest uppercase mb-2">วิเคราะห์เจาะลึก</h3>
                  <p className="font-kanit text-lg md:text-xl text-ghibli-ink font-medium leading-relaxed">
                    {soulType.insight}
                  </p>
                </div>
              </motion.div>

              {/* Shadow Point Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-ghibli-sunset/[0.08] border border-ghibli-sunset/20 rounded-2xl p-6 md:p-8 flex items-start gap-4 hover:bg-ghibli-sunset/[0.12] transition-colors group shadow-sm"
              >
                <div className="p-3 bg-ghibli-sunset text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform flex-shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-kanit font-bold text-ghibli-sunset text-sm tracking-widest uppercase mb-2">จุดบอดที่ต้องระวัง</h3>
                  <p className="font-kanit text-lg md:text-xl text-ghibli-ink font-medium leading-relaxed">
                    {soulType.weakness}
                  </p>
                </div>
              </motion.div>

              {/* Upskill Quest Section - Enhanced Readability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-ghibli-sky/[0.08] border-2 border-ghibli-sky/30 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:bg-ghibli-sky/[0.12] transition-all duration-500 shadow-md"
              >
                {/* Decorative Background Element */}
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Zap size={120} className="text-ghibli-sky" />
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                  <div className="p-5 bg-ghibli-sky text-white rounded-2xl shadow-lg group-hover:rotate-12 transition-transform flex-shrink-0">
                    <Zap size={32} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-ghibli-sky/20 rounded-full mb-3">
                      <h3 className="font-kanit font-bold text-[10px] text-ghibli-sky tracking-widest uppercase">ภารกิจอัปสกิล</h3>
                    </div>
                    {/* Darker Sky color for the main title as requested */}
                    <h4 className="text-2xl md:text-4xl font-kanit font-bold text-ghibli-sky mb-4 leading-tight">
                      {soulType.upskillTitle}
                    </h4>
                    <div className="h-[2px] w-16 bg-ghibli-sky/40 mb-6 mx-auto md:mx-0" />
                    <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-ghibli-sky/10 shadow-inner">
                       <p className="font-kanit text-lg md:text-2xl text-ghibli-ink leading-relaxed font-medium">
                          {soulType.upskillDetail}
                       </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

        {/* Action Buttons - Standardized Height for All Devices */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="ghibli-button min-h-[80px] px-6 flex items-center justify-center gap-3 text-lg md:text-xl shadow-xl disabled:opacity-50 font-kanit w-full"
          >
            {isExporting ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : (
              <Download size={24} />
            )}
            <span className="whitespace-nowrap">บันทึกรูปผลลัพธ์</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/quiz')}
            className="bg-white hover:bg-ghibli-cream text-ghibli-green border-2 border-ghibli-green/20 rounded-2xl min-h-[80px] px-6 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-3 text-lg md:text-xl font-bold font-kanit w-full"
          >
            <RefreshCw size={24} />
            <span className="whitespace-nowrap">เล่นใหม่อีกครั้ง</span>
          </motion.button>

          <motion.a
            href="https://lin.ee/6GMd8ZM"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-ghibli-green to-ghibli-leaf text-white rounded-2xl min-h-[80px] px-4 flex items-center justify-center gap-3 shadow-xl transition-all font-kanit group relative overflow-hidden w-full"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap size={24} className="fill-white" />
            </motion.div>
            <span className="text-base md:text-lg lg:text-xl font-bold tracking-wide whitespace-nowrap">
              ติดตามอัพสกิลกับฟุ้ย
            </span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 text-ghibli-green/40 font-kanit font-bold text-[10px] tracking-widest uppercase">
            <div className="h-[1px] w-12 bg-ghibli-green/20" />
            <span>Upskill Everyday</span>
            <div className="h-[1px] w-12 bg-ghibli-green/20" />
          </div>
        </motion.div>
      </motion.div>

      {/* Finishing Grass */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-ghibli-green/10 to-transparent pointer-events-none" />
    </main>
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
