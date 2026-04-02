'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guestId, setGuestId] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'RAGNAR-FF10-FREE') {
      setIsAuthenticated(true);
      setError('');
      // Auto-play music
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(console.log);
      }
    } else {
      setError('Invalid access code');
    }
  };

  // Start bot
  const startBot = async () => {
    if (!guestId || !guestPassword) {
      setError('Please enter GUEST ID and PASSWORD');
      return;
    }

    setIsBotRunning(true);
    setLogs([]);
    setError('');

    try {
      // Save credentials
      const saveRes = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_credentials',
          guest_id: guestId,
          guest_password: guestPassword,
        }),
      });

      if (!saveRes.ok) throw new Error('Failed to save credentials');

      // Start bot process
      const startRes = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_bot' }),
      });

      if (!startRes.ok) throw new Error('Failed to start bot');

      // Connect to SSE for live logs
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource('/api/bot?action=stream_logs');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.log) {
          setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${data.log}`]);
        }
        if (data.status === 'completed' || data.status === 'error') {
          setIsBotRunning(false);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        setIsBotRunning(false);
        eventSource.close();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start bot');
      setIsBotRunning(false);
    }
  };

  // Stop bot
  const stopBot = async () => {
    try {
      await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop_bot' }),
      });
      setIsBotRunning(false);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      setLogs((prev) => [...prev, '[SYSTEM] Bot stopped by user']);
    } catch (err) {
      console.error('Failed to stop bot:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 360° Rotating Conic Gradient Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 rotate-conic" style={{ filter: 'blur(100px)' }} />
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} loop src="/ambient.mp3" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          // Phase 1: Security Login Card
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex items-center justify-center min-h-screen p-4"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-75 animate-pulse" />
              <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30 shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold glow-text bg-gradient-to-r from-red-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    RAGNAR BOT
                  </h1>
                  <p className="text-gray-400 mt-2">Free Fire Automation System</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-400 mb-2">
                      ACCESS CODE
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-900 border border-red-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                      placeholder="Enter your access code"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    ENTER THE MATRIX
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-600">
                  <p>⚡ RAGNAR EDITION ⚡</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Phase 2-4: Main Panel
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen p-6"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-5xl font-bold glow-text bg-gradient-to-r from-red-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  RAGNAR BOT MANAGER
                </h1>
                <p className="text-gray-400 mt-2">Legendary Edition | Free Fire Automation</p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Panel - Credentials */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 neon-border"
                >
                  <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                    GUEST CREDENTIALS
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        GUEST ID
                      </label>
                      <input
                        type="text"
                        value={guestId}
                        onChange={(e) => setGuestId(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="Enter Guest ID"
                        disabled={isBotRunning}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        GUEST PASSWORD
                      </label>
                      <input
                        type="password"
                        value={guestPassword}
                        onChange={(e) => setGuestPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                        placeholder="Enter Guest Password"
                        disabled={isBotRunning}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={startBot}
                        disabled={isBotRunning}
                        className="flex-1 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                      >
                        {isBotRunning ? '⚡ BOT RUNNING...' : '🚀 START BOT'}
                      </button>

                      <button
                        onClick={stopBot}
                        disabled={!isBotRunning}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                      >
                        ⏹️ STOP BOT
                      </button>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
                      >
                        ⚠️ {error}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Right Panel - Terminal */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-black/80 backdrop-blur-xl rounded-2xl border border-red-500/30 p-6 neon-border"
                >
                  <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    LIVE TERMINAL
                  </h2>

                  <div
                    ref={terminalRef}
                    className="terminal-bg rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm"
                  >
                    {logs.length === 0 ? (
                      <div className="text-gray-500 text-center mt-32">
                        <p>┌─[ Waiting for bot to start ]</p>
                        <p>└─► System ready. Enter credentials and click START.</p>
                      </div>
                    ) : (
                      logs.map((log, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-green-400' : 'text-cyan-400'} mb-1`}
                        >
                          {log}
                        </motion.div>
                      ))
                    )}
                    {isBotRunning && (
                      <div className="text-yellow-400 animate-pulse mt-2">
                        ⚡ Bot is processing...
                      </div>
                    )}
                  </div>

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                    LIVE CONNECTION ACTIVE
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}