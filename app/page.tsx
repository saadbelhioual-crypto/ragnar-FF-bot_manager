'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [guestId, setGuestId] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'RAGNAR-FF10-FREE') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid access code');
    }
  };

  const startBot = () => {
    if (!guestId || !guestPassword) {
      setError('Please enter GUEST ID and PASSWORD');
      return;
    }
    setIsBotRunning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✓ Bot started for ID: ${guestId}`]);
    setTimeout(() => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔄 Connecting to server...`]);
    }, 1000);
    setTimeout(() => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Authentication successful`]);
    }, 2000);
  };

  const stopBot = () => {
    setIsBotRunning(false);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⏹️ Bot stopped`]);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0f0f1a',
      position: 'relative'
    }}>
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '1rem'
            }}
          >
            <div style={{
              background: '#1a1a2e',
              borderRadius: '1rem',
              padding: '2.5rem',
              width: '100%',
              maxWidth: '26rem',
              border: '1px solid #2d3561'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 1rem',
                  borderRadius: '0.75rem',
                  background: '#2d3561'
                }} />
                <h1 style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#e0e0e0',
                  letterSpacing: '0.05em'
                }}>
                  ACCESS CODE
                </h1>
              </div>

              <form onSubmit={handleLogin}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0a0a0f',
                    border: '1px solid #2d3561',
                    borderRadius: '0.5rem',
                    padding: '0.875rem 1rem',
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                    outline: 'none'
                  }}
                  placeholder="Enter access code"
                />

                {error && (
                  <div style={{
                    color: '#e74c3c',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    ⚠ {error}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#2d3561',
                    color: 'white',
                    fontWeight: '500',
                    padding: '0.875rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#3d4571'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#2d3561'}
                >
                  VERIFY
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              minHeight: '100vh',
              padding: '2rem'
            }}
          >
            <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '600',
                  color: '#e0e0e0',
                  marginBottom: '0.5rem'
                }}>
                  Bot Manager
                </h1>
                <p style={{ color: '#888', fontSize: '0.875rem' }}>
                  Free Fire Automation System
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Left Panel */}
                <div style={{
                  background: '#1a1a2e',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #2d3561'
                }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    color: '#ccc',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #2d3561'
                  }}>
                    Credentials
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        GUEST ID
                      </label>
                      <input
                        type="text"
                        value={guestId}
                        onChange={(e) => setGuestId(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#0a0a0f',
                          border: '1px solid #2d3561',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          color: '#e0e0e0',
                          outline: 'none'
                        }}
                        disabled={isBotRunning}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        GUEST PASSWORD
                      </label>
                      <input
                        type="password"
                        value={guestPassword}
                        onChange={(e) => setGuestPassword(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#0a0a0f',
                          border: '1px solid #2d3561',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          color: '#e0e0e0',
                          outline: 'none'
                        }}
                        disabled={isBotRunning}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
                      <button
                        onClick={startBot}
                        disabled={isBotRunning}
                        style={{
                          flex: 1,
                          background: '#2d3561',
                          color: 'white',
                          fontWeight: '500',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: isBotRunning ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isBotRunning) e.currentTarget.style.background = '#3d4571';
                        }}
                        onMouseLeave={(e) => {
                          if (!isBotRunning) e.currentTarget.style.background = '#2d3561';
                        }}
                      >
                        {isBotRunning ? 'RUNNING' : 'START BOT'}
                      </button>

                      <button
                        onClick={stopBot}
                        disabled={!isBotRunning}
                        style={{
                          flex: 1,
                          background: '#2d3561',
                          color: 'white',
                          fontWeight: '500',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: 'none',
                          cursor: 'pointer',
                          opacity: !isBotRunning ? 0.6 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (isBotRunning) e.currentTarget.style.background = '#c0392b';
                        }}
                        onMouseLeave={(e) => {
                          if (isBotRunning) e.currentTarget.style.background = '#2d3561';
                        }}
                      >
                        STOP BOT
                      </button>
                    </div>

                    {error && (
                      <div style={{
                        background: '#2d1a1a',
                        border: '1px solid #e74c3c',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        color: '#e74c3c',
                        textAlign: 'center',
                        fontSize: '0.875rem'
                      }}>
                        ⚠ {error}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Terminal */}
                <div style={{
                  background: '#1a1a2e',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid #2d3561'
                }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    color: '#ccc',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid #2d3561'
                  }}>
                    Terminal
                  </h2>

                  <div style={{
                    background: '#0a0a0f',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    height: '24rem',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.813rem'
                  }}>
                    {logs.length === 0 ? (
                      <div style={{ color: '#555', textAlign: 'center', marginTop: '8rem' }}>
                        <p>Waiting for bot to start...</p>
                      </div>
                    ) : (
                      logs.map((log, idx) => (
                        <div key={idx} style={{
                          color: log.includes('✓') ? '#6ab04c' : '#e0e0e0',
                          marginBottom: '0.5rem',
                          fontSize: '0.813rem'
                        }}>
                          {log}
                        </div>
                      ))
                    )}
                    {isBotRunning && (
                      <div style={{ color: '#6ab04c', marginTop: '0.5rem', fontSize: '0.813rem' }}>
                        ● Bot is active
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '0.5rem',
                      height: '0.5rem',
                      background: isBotRunning ? '#6ab04c' : '#555',
                      borderRadius: '50%',
                      marginRight: '0.5rem'
                    }} />
                    <span style={{ color: '#666', fontSize: '0.75rem' }}>
                      {isBotRunning ? 'CONNECTED' : 'STANDBY'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
