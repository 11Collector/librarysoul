"use client";

import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle2, XCircle, Activity, Key, Globe, Database } from "lucide-react";
import Link from "next/link";

export default function DebugPage() {
  const [configStatus, setConfigStatus] = useState<Record<string, { present: boolean; preview: string }>>({});
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [authState, setAuthState] = useState<{ status: 'loading' | 'signed_in' | 'error'; uid?: string; error?: string }>({ status: 'loading' });

  useEffect(() => {
    // 1. Check Config
    const config = {
      API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const status: Record<string, { present: boolean; preview: string }> = {};
    Object.entries(config).forEach(([key, value]) => {
      status[key] = {
        present: !!value,
        preview: value ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}` : 'N/A'
      };
    });
    setConfigStatus(status);

    // 2. Check Auth
    signInAnonymously(auth)
      .then((user) => {
        setAuthState({ status: 'signed_in', uid: user.user.uid });
      })
      .catch((err) => {
        setAuthState({ status: 'error', error: err.message });
      });
  }, []);

  const testFirestore = async () => {
    setTestResult({ status: 'testing', message: 'Attempting to write a test document...' });
    try {
      const docRef = await addDoc(collection(db, "debug_tests"), {
        timestamp: serverTimestamp(),
        message: "Production Health Check",
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
      });
      setTestResult({ status: 'success', message: `Successfully wrote document with ID: ${docRef.id}` });
    } catch (error: any) {
      console.error("Debug Test Failed:", error);
      setTestResult({ status: 'error', message: error.message || String(error) });
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-ghibli-green rounded-2xl text-white shadow-lg shadow-ghibli-green/20">
              <ShieldAlert size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">System Diagnostic Hub</h1>
          </div>
          <p className="text-ghibli-ink/60">Troubleshooting Firebase connectivity and Environment Variables.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section: Env Vars */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
            <div className="flex items-center gap-2 mb-6 text-ghibli-ink">
              <Key size={20} />
              <h2 className="text-xl font-bold">Environment Variables</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(configStatus).map(([key, info]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key}</span>
                    <span className="text-sm font-mono text-gray-700">{info.preview}</span>
                  </div>
                  {info.present ? (
                    <CheckCircle2 className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              ))}
            </div>
            {!Object.values(configStatus).every(i => i.present) && (
              <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm flex items-start gap-3">
                <XCircle size={18} className="mt-0.5 shrink-0" />
                <p>One or more critical variables are missing. Please check your Hosting Dashboard (Vercel/Netlify).</p>
              </div>
            )}
          </section>

          {/* Section: Firebase Tests */}
          <div className="space-y-8">
            {/* Auth Status */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
              <div className="flex items-center gap-2 mb-6 text-ghibli-ink">
                <Globe size={20} />
                <h2 className="text-xl font-bold">Authentication</h2>
              </div>
              
              <div className="flex items-center gap-3">
                {authState.status === 'signed_in' ? (
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle2 size={18} />
                    <span>Signed In Anonymously</span>
                  </div>
                ) : authState.status === 'loading' ? (
                  <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                    <Activity size={18} />
                    <span>Verifying Identity...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <XCircle size={18} />
                      <span>Auth Failed</span>
                    </div>
                    <p className="text-xs text-red-400">{authState.error}. Ensure Anonymous Auth is enabled in Firebase Console.</p>
                  </div>
                )}
              </div>
              {authState.uid && <p className="mt-2 text-[10px] font-mono text-gray-400">UID: {authState.uid}</p>}
            </section>

            {/* Firestore Test */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
              <div className="flex items-center gap-2 mb-6 text-ghibli-ink">
                <Database size={20} />
                <h2 className="text-xl font-bold">Database Health</h2>
              </div>
              
              <button
                onClick={testFirestore}
                disabled={testResult.status === 'testing'}
                className="w-full py-4 bg-ghibli-ink text-white rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {testResult.status === 'testing' ? 'Connecting...' : 'Run Write Test'}
              </button>

              {testResult.status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-2xl text-sm break-words ${
                    testResult.status === 'success' ? 'bg-green-50 text-green-800 border border-green-100' :
                    testResult.status === 'error' ? 'bg-red-50 text-red-800 border border-red-100' :
                    'bg-blue-50 text-blue-800 border border-blue-100'
                  }`}
                >
                  <p className="font-bold mb-1 uppercase text-[10px] opacity-70">
                    {testResult.status === 'success' ? 'Success' : testResult.status === 'error' ? 'Error Report' : 'In Progress'}
                  </p>
                  <p>{testResult.message}</p>
                </motion.div>
              )}
            </section>
          </div>
        </div>

        <footer className="mt-12 text-center">
            <Link href="/" className="text-ghibli-green font-bold underline hover:opacity-70">
                Back to Library
            </Link>
        </footer>
      </div>
    </main>
  );
}
