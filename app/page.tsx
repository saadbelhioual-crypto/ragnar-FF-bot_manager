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
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✓ Bot started`]);
  };

  const stopBot = () => {
    setIsBotRunning(false);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⏹️ Bot stopped`]);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* الخلفية المتدرجة بنفس ألوان الصورة */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, #ff0000, #8a2be2, #0a0a0a)',
        opacity: 0.3,
        zIndex: 0
      }} />

      {/* تأثير النيون المتحرك */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '-20%',
        width: '140%',
        height: '60%',
        background: 'linear-gradient(90deg, transparent, #ff0040, #00ffff, #ff00ff, transparent)',
        filter: 'blur(60px)',
        opacity: 0.15,
        animation: 'slideNeon 8s ease-in-out infinite',
        zIndex: 0
      }} />

      <style jsx>{`
        @keyframes slideNeon {
          0%, 100% { transform: translateX(-10%) translateY(0%); }
          50% { transform: translateX(10%) translateY(5%); }
        }
        
        @keyframes borderGlow {
          0%, 100% { 
            border-color: #ff0040;
            box-shadow: 0 0 20px #ff0040, 0 0 40px #8a2be2;
          }
          50% { 
            border-color: #00ffff;
            box-shadow: 0 0 30px #00ffff, 0 0 60px #ff00ff;
          }
        }
        
        @keyframes buttonNeon {
          0%, 100% { 
            box-shadow: 0 0 15px #ff0040, 0 0 30px #8a2be2;
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 25px #00ffff, 0 0 50px #ff00ff;
            transform: scale(1.03);
          }
        }
        
        @keyframes textNeon {
          0%, 100% { text-shadow: 0 0 8px #ff0040, 0 0 16px #8a2be2; }
          50% { text-shadow: 0 0 12px #00ffff, 0 0 24px #ff00ff; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '1rem'
            }}
          >
            <div style={{
              background: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              padding: '2.5rem',
              width: '100%',
              maxWidth: '26rem',
              border: '2px solid',
              borderColor: '#ff0040',
              animation: 'borderGlow 2s ease-in-out infinite'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '5rem',
                  height: '5rem',
                  margin: '0 auto 1.5rem',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, #ff0040, #8a2be2, #00ffff)',
                  animation: 'pulseGlow 2s ease-in-out infinite'
                }} />
                
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  color: '#00ffff',
                  animation: 'textNeon 2s ease-in-out infinite',
                  letterSpacing: '0.1em'
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
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid #ff0040',
                    borderRadius: '1rem',
                    padding: '1rem 1.5rem',
                    color: '#00ffff',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    letterSpacing: '0.05em',
                    marginBottom: '1.5rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ffff';
                    e.target.style.boxShadow = '0 0 20px #00ffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ff0040';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="••••••••••••••"
                />

                {error && (
                  <div style={{
                    color: '#ff0040',
                    textAlign: 'center',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    animation: 'textNeon 1s ease-in-out infinite'
                  }}>
                    ⚠ {error}
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ff0040, #8a2be2)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '1rem',
                    borderRadius: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    animation: 'buttonNeon 2s ease-in-out infinite'
                  }}
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
              position: 'relative',
              zIndex: 10,
              minHeight: '100vh',
              padding: '2rem'
            }}
          >
            <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
              {/* Header */}
              <motion.div
                initial={{ y: -30 }}
                animate={{ y: 0 }}
                style={{ textAlign: 'center', marginBottom: '3rem' }}
              >
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  margin: '0 auto 1rem',
                  borderRadius: '1.5rem',
                  background: 'linear-gradient(135deg, #ff0040, #8a2be2, #00ffff)',
                  animation: 'pulseGlow 2s ease-in-out infinite'
                }} />
              </motion.div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Left Panel */}
                <div style={{
                  background: 'rgba(10, 10, 10, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '2px solid',
                  borderColor: '#ff0040',
                  animation: 'borderGlow 2s ease-in-out infinite'
                }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '0.25rem',
                      background: 'linear-gradient(90deg, #ff0040, #00ffff)',
                      marginBottom: '1rem'
                    }} />
                    <h2 style={{
                      fontSize: '1.5rem',
                      color: '#00ffff',
                      animation: 'textNeon 2s ease-in-out infinite'
                    }}>
                      CREDENTIALS
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', color: '#8a2be2', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        GUEST ID
                      </label>
                      <input
                        type="text"
                        value={guestId}
                        onChange={(e) => setGuestId(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid #ff0040',
                          borderRadius: '0.75rem',
                          padding: '0.75rem 1rem',
                          color: '#00ffff',
                          outline: 'none'
                        }}
                        disabled={isBotRunning}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: '#8a2be2', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        GUEST PASSWORD
                      </label>
                      <input
                        type="password"
                        value={guestPassword}
                        onChange={(e) => setGuestPassword(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 0, 0, 0.6)',
                          border: '1px solid #ff0040',
                          borderRadius: '0.75rem',
                          padding: '0.75rem 1rem',
                          color: '#00ffff',
                          outline: 'none'
                        }}
                        disabled={isBotRunning}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem' }}>
                      <button
                        onClick={startBot}
                        disabled={isBotRunning}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #ff0040, #8a2be2)',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '0.875rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          cursor: 'pointer',
                          animation: 'buttonNeon 2s ease-in-out infinite'
                        }}
                      >
                        {isBotRunning ? 'ACTIVE' : 'START'}
                      </button>

                      <button
                        onClick={stopBot}
                        disabled={!isBotRunning}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #8a2be2, #ff0040)',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '0.875rem',
                          borderRadius: '0.75rem',
                          border: 'none',
                          cursor: 'pointer',
                          animation: 'buttonNeon 2s ease-in-out infinite'
                        }}
                      >
                        STOP
                      </button>
                    </div>

                    {error && (
                      <div style={{
                        background: 'rgba(255, 0, 64, 0.1)',
                        border: '1px solid #ff0040',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        color: '#ff0040',
                        textAlign: 'center'
                      }}>
                        ⚠ {error}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Panel - Terminal */}
                <div style={{
                  background: 'rgba(10, 10, 10, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '1.5rem',
                  padding: '2rem',
                  border: '2px solid',
                  borderColor: '#8a2be2',
                  animation: 'borderGlow 2s ease-in-out infinite'
                }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '0.25rem',
                      background: 'linear-gradient(90deg, #8a2be2, #ff00ff)',
                      marginBottom: '1rem'
                    }} />
                    <h2 style={{
                      fontSize: '1.5rem',
                      color: '#ff00ff',
                      animation: 'textNeon 2s ease-in-out infinite'
                    }}>
                      TERMINAL
                    </h2>
                  </div>

                  <div style={{
                    background: '#000000',
                    borderRadius: '1rem',
                    padding: '1rem',
                    height: '24rem',
                    overflowY: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    border: '1px solid #8a2be2'
                  }}>
                    {logs.length === 0 ? (
                      <div style={{ color: '#8a2be2', textAlign: 'center', marginTop: '8rem' }}>
                        <span style={{ animation: 'pulseGlow 2s ease-in-out infinite', display: 'inline-block' }}>
                          ●
                        </span>
                      </div>
                    ) : (
                      logs.map((log, idx) => (
                        <div key={idx} style={{
                          color: log.includes('✓') ? '#00ffff' : '#ff00ff',
                          marginBottom: '0.5rem'
                        }}>
                          {log}
                        </div>
                      ))
                    )}
                    {isBotRunning && (
                      <div style={{ color: '#00ffff', animation: 'pulseGlow 1s ease-in-out infinite', marginTop: '0.5rem' }}>
                        ● PROCESSING
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '0.5rem',
                      height: '0.5rem',
                      background: '#00ffff',
                      borderRadius: '50%',
                      animation: 'pulseGlow 1s ease-in-out infinite',
                      marginRight: '0.5rem'
                    }} />
                    <span style={{ color: '#8a2be2', fontSize: '0.75rem' }}>● LIVE</span>
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
