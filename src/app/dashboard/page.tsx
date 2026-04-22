"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { results, ResultType } from "@/data/results";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Stats {
  type: string;
  count: number;
  percentage: number;
  data: ResultType;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'online' | 'offline'>('testing');

  const fetchStats = async () => {
    setLoading(true);
    setConnectionStatus('testing');

    try {
      const q = query(collection(db, "assessment_results"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      setConnectionStatus('online');

      const counts: Record<string, number> = {};
      let totalCount = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const type = data.mbtiType;
        if (type) {
          counts[type] = (counts[type] || 0) + 1;
          totalCount++;
        }
      });

      const aggregatedStats: Stats[] = Object.entries(counts)
        .map(([type, count]) => ({
          type,
          count,
          percentage: (count / totalCount) * 100,
          data: results[type] || results["ISFJ"]
        }))
        .sort((a, b) => b.count - a.count);

      setStats(aggregatedStats);
      setTotal(totalCount);
    } catch (error) {
      console.error("Firebase connection failed:", error);
      setConnectionStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-ghibli-cream p-4 md:p-12 font-kanit">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white rounded-full shadow-md text-ghibli-green"
              >
                <ArrowLeft size={24} />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-ghibli-ink flex items-center gap-3">
                <BarChart3 className="text-ghibli-green" />
                Soul Statistics
              </h1>
              <p className="text-ghibli-ink/60">คลังสถิติวิญญาณนักอ่านทั่วโลก</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border shadow-sm ${connectionStatus === 'online' ? 'bg-green-50 text-green-700 border-green-200' :
                connectionStatus === 'offline' ? 'bg-red-50 text-red-700 border-red-200' :
                  'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
              }`}>
              {connectionStatus === 'online' ? <CheckCircle2 size={16} /> :
                connectionStatus === 'offline' ? <AlertCircle size={16} /> :
                  <RefreshCw size={16} className="animate-spin" />}
              {connectionStatus === 'online' ? 'Firebase Online' :
                connectionStatus === 'offline' ? 'Connection Error' :
                  'Testing Connection...'}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStats}
              className="p-3 bg-ghibli-green text-white rounded-full shadow-lg"
            >
              <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-ghibli-green/5"
          >
            <div className="p-4 bg-ghibli-sky/10 text-ghibli-sky rounded-2xl">
              <Users size={32} />
            </div>
            <div>
              <p className="text-ghibli-ink/40 text-sm uppercase tracking-widest font-bold">Total Souls</p>
              <h2 className="text-4xl font-bold text-ghibli-ink">
                {loading ? "..." : total}
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-ghibli-green/5"
          >
            <div className="p-4 bg-ghibli-sunset/10 text-ghibli-sunset rounded-2xl">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="text-ghibli-ink/40 text-sm uppercase tracking-widest font-bold">Top Persona</p>
              <h2 className="text-2xl font-bold text-ghibli-ink">
                {loading ? "..." : stats[0]?.data.title || "Waiting..."}
              </h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-xl flex items-center gap-6 border border-ghibli-green/5"
          >
            <div className="p-4 bg-ghibli-leaf/10 text-ghibli-leaf rounded-2xl">
              <Sparkles size={32} />
            </div>
            <div>
              <p className="text-ghibli-ink/40 text-sm uppercase tracking-widest font-bold">Unique Views</p>
              <h2 className="text-4xl font-bold text-ghibli-ink">
                {loading ? "..." : stats.length} / 16
              </h2>
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCw className="animate-spin text-ghibli-green" size={48} />
            <p className="text-ghibli-green font-bold animate-pulse tracking-widest uppercase">เปิดบันทึกวิญญาณ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.length > 0 ? stats.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-lg border border-ghibli-green/5 overflow-hidden flex flex-col"
              >
                <div className="p-6 flex items-center gap-4 border-b border-ghibli-green/5">
                  <div className="relative w-16 h-16 bg-ghibli-cream rounded-xl overflow-hidden shadow-inner flex items-center justify-center text-3xl">
                    {/* We use image if exists, else fallback to emoji */}
                    <Image
                      src={item.data.bookImage}
                      alt={item.type}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-ghibli-ink text-lg leading-tight">{item.data.title}</h3>
                    <p className="text-ghibli-green font-bold text-sm">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ghibli-ink">{Math.round(item.percentage)}%</p>
                    <p className="text-ghibli-ink/40 text-xs font-bold uppercase">{item.count} Souls</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-4 bg-ghibli-cream/50">
                  <div className="h-3 w-full bg-white rounded-full overflow-hidden shadow-inner border border-ghibli-green/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.05) }}
                      className="h-full bg-gradient-to-r from-ghibli-green to-ghibli-leaf"
                    />
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <p className="text-sm text-ghibli-ink/70 italic line-clamp-2">
                    "{item.data.vibe}"
                  </p>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-full bg-white p-20 rounded-3xl shadow-xl text-center border border-dashed border-ghibli-green/20">
                <BookOpen size={64} className="mx-auto text-ghibli-green/20 mb-6" />
                <h3 className="text-2xl font-bold text-ghibli-ink">ยังไม่มีบันทึกข้อมูลวิญญาณในขณะนี้</h3>
                <p className="text-ghibli-ink/40 mt-2">เชิญชวนเพื่อนๆ มาทำแบบทดสอบเพื่อเริ่มต้นการบันทึกสถิติ!</p>
                <Link href="/quiz">
                  <button className="mt-8 ghibli-button px-10 py-4 text-lg">เริ่มต้นทำควิซ</button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-20 text-center text-ghibli-ink/20 font-bold tracking-[0.3em] uppercase text-xs">
          Soul Library Ecosystem v1.0 • Real-time Data
        </div>
      </div>
    </main>
  );
}
