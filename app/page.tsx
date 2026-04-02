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

  // جزيئات متطايرة
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; size: string }>>([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 10}s`,
        size: `${Math.random() * 5 + 2}px`,
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'RAGNAR-FF10-FREE') {
      setIsAuthenticated(true);
      setError('');
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(console.log);
      }
    } else {
      setError('Invalid access code');
    }
  };

  const startBot = async () => {
    if (!guestId || !guestPassword) {
      setError('Please enter GUEST ID and PASSWORD');
      return;
    }

    setIsBotRunning(true);
    setLogs([]);
    setError('');

    try {
      const saveRes = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_credentials',
          guest_id: guestId,
          guest_password: guestPassword,
        }),
      });

      const saveData = await saveRes.json();
      
      if (!saveRes.ok) {
        throw new Error(saveData.error || 'Failed to save credentials');
      }

      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✓ Credentials saved for ID: ${guestId}`]);

      const startRes = await fetch('/api/bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_bot' }),
      });

      const startData = await startRes.json();
      
      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to start bot');
      }

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
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ⚠ Bot stopped by user`]);
    } catch (err) {
      console.error('Failed to stop bot:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* خلفية دوارة متحركة */}
      <div className="rotating-gradient" />
      
      {/* جزيئات متطايرة */}
      <div className="floating-particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      <audio ref={audioRef} loop src="/ambient.mp3" />

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 flex items-center justify-center min-h-screen p-4"
          >
            <div className="neon-card w-full max-w-md">
              <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-8">
                <div className="text-center mb-8">
                  <h1 className="text-5xl font-bold neon-text mb-2">
                    RAGNAR BOT
                  </h1>
                  <p className="text-gray-400 mt-2 animate-pulse">⚡ Free Fire Automation System ⚡</p>
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
                      className="neon-input w-full bg-gray-900 rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                      placeholder="Enter RAGNAR-FF10-FREE"
                      autoFocus
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm text-center animate-pulse"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="neon-button-start w-full text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    🚀 ENTER THE MATRIX 🚀
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-600">
                  <p className="animate-pulse">🔥 RAGNAR LEGENDARY EDITION 🔥</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 min-h-screen p-6"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="text-6xl font-bold neon-text mb-2">
                  RAGNAR BOT MANAGER
                </h1>
                <p className="text-gray-400 mt-2 text-lg animate-pulse">
                  ⚡ Legendary Edition | Free Fire Automation ⚡
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Panel */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="neon-card"
                >
                  <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2 animate-pulse">
                      <span className="w-3 h-3 bg-cyan-500 rounded-full animate-ping" />
                      🔐 GUEST CREDENTIALS
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
                          className="neon-input w-full bg-gray-900 rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
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
                          className="neon-input w-full bg-gray-900 rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                          placeholder="Enter Guest Password"
                          disabled={isBotRunning}
                        />
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={startBot}
                          disabled={isBotRunning}
                          className="neon-button-start flex-1 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isBotRunning ? '⚡ BOT RUNNING...' : '🚀 START BOT'}
                        </button>

                        <button
                          onClick={stopBot}
                          disabled={!isBotRunning}
                          className="neon-button-stop flex-1 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ⏹️ STOP BOT
                        </button>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-red-500/20 border-2 border-red-500 rounded-lg p-3 text-red-400 text-sm animate-pulse"
                        >
                          ⚠️ {error}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Right Panel - Terminal */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="neon-card"
                >
                  <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2 animate-pulse">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                      💻 LIVE TERMINAL
                    </h2>

                    <div
                      ref={terminalRef}
                      className="neon-terminal rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm"
                    >
                      {logs.length === 0 ? (
                        <div className="text-gray-500 text-center mt-32">
                          <p className="animate-pulse">┌─[ System Ready ]</p>
                          <p className="animate-pulse">└─► Enter credentials and click START</p>
                        </div>
                      ) : (
                        logs.map((log, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`${
                              log.includes('ERROR') ? 'text-red-400 animate-pulse' : 
                              log.includes('✓') ? 'text-green-400' : 
                              log.includes('⚠') ? 'text-yellow-400' :
                              'text-cyan-400'
                            } mb-1`}
                          >
                            {log}
                          </motion.div>
                        ))
                      )}
                      {isBotRunning && (
                        <div className="text-yellow-400 animate-pulse mt-2">
                          ⚡ Bot is processing... ⚡
                        </div>
                      )}
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-ping mr-2" />
                      <span className="animate-pulse">⚡ LIVE CONNECTION ACTIVE ⚡</span>
                    </div>
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
