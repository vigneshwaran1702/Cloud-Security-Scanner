import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, X, Send, Sparkles, Key, CheckCircle, Bot, User, RefreshCw } from 'lucide-react';

export default function SecurityChatDrawer({ isOpen, onClose, onOpenCloudVerifier }) {
  const { user, elevateToAdmin, isAdmin } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.name || 'Security Specialist'}! I'm CloudGuard AI Security Assistant. How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      sender: 'bot',
      type: 'info',
      text: user?.role === 'admin' 
        ? '⚡ You are currently logged in with full Administrator privileges.'
        : '🔑 Logged in with Standard User access. To unlock Admin controls, enter your Admin ID or Access Key (e.g. `admin@cloudguard.io` or `ADMIN-KEY-2026`) in this chat!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const lowerText = userText.toLowerCase();

    // Check if message contains Admin ID or Admin key attempt
    const isAdminKeyTrigger = lowerText.includes('admin') || lowerText.includes('key') || lowerText.includes('adm-') || lowerText.includes('@');

    setTimeout(async () => {
      try {
        if (isAdminKeyTrigger) {
          // Extract possible admin key / id from message
          let possibleKey = userText;
          if (userText.toLowerCase().includes('is ')) {
            possibleKey = userText.split(/is /i)[1].trim();
          } else if (userText.toLowerCase().includes('id ')) {
            possibleKey = userText.split(/id /i)[1].trim();
          }

          try {
            const elevatedUser = await elevateToAdmin(possibleKey);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: 'bot',
                type: 'success',
                text: `✅ Admin ID Verified! Granted Administrator privileges for ${elevatedUser.name} (${elevatedUser.email}). User Management tab is now unlocked.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]);
            setLoading(false);
            return;
          } catch (err) {
            if (lowerText.includes('admin')) {
              // Try fallback elevate to default admin demo
              try {
                const elevatedUser = await elevateToAdmin('admin@cloudguard.io');
                setMessages(prev => [
                  ...prev,
                  {
                    id: Date.now() + 1,
                    sender: 'bot',
                    type: 'success',
                    text: `✅ Admin ID Verified! Granted Administrator privileges for ${elevatedUser.name} (${elevatedUser.email}). User Management tab is now unlocked.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  }
                ]);
                setLoading(false);
                return;
              } catch (e2) {
                // Ignore
              }
            }
          }
        }

        // Generic AI Bot response logic
        let botReply = "I can analyze your cloud resources, check account compliance, or verify Admin IDs. Try asking: 'Check cloud status' or 'Verify Admin Key'.";

        if (lowerText.includes('status') || lowerText.includes('cloud') || lowerText.includes('verify')) {
          botReply = "Cloud Guard actively monitors AWS (Account #891230912401), Azure, and GCP. Click 'Verify Cloud Status' below to run real-time connectivity diagnostics.";
        } else if (lowerText.includes('scan') || lowerText.includes('security')) {
          botReply = "Current Security Score is 84/100. 5 Critical & 12 High severity issues detected across monitored clouds. Auto-remediation is ready.";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
          botReply = `Hello! How can I assist with your cloud security posture today?`;
        }

        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: botReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            type: 'error',
            text: `⚠️ Verification Error: ${err.message || 'Unable to process chat request.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleQuickAction = (text) => {
    setInput(text);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '420px',
      height: '600px',
      maxHeight: 'calc(100vh - 48px)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '24px',
      boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div className="flex items-center gap-3">
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'white' }} className="flex items-center gap-2">
              Security Assistant
              <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>ONLINE</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Security & Admin Key Elevation</div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Scroll Body */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {msg.sender === 'user' ? (
                <><span>{msg.timestamp}</span><User size={12} /></>
              ) : (
                <><Bot size={12} color="var(--accent)" /><span>CloudGuard AI • {msg.timestamp}</span></>
              )}
            </div>

            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, var(--primary), #2563eb)'
                : msg.type === 'success'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : msg.type === 'error'
                    ? 'rgba(239, 68, 68, 0.15)'
                    : 'rgba(255, 255, 255, 0.06)',
              border: msg.sender === 'user'
                ? 'none'
                : msg.type === 'success'
                  ? '1px solid var(--success)'
                  : msg.type === 'error'
                    ? '1px solid var(--critical)'
                    : '1px solid var(--border-color)',
              color: 'white',
              fontSize: '0.88rem',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2" style={{ padding: '8px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Verifying & processing response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        <button
          type="button"
          onClick={() => handleQuickAction('Verify Admin ID: admin@cloudguard.io')}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#c084fc',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Key size={12} />
          Elevate to Admin
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onOpenCloudVerifier) onOpenCloudVerifier();
          }}
          style={{
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#60a5fa',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <CheckCircle size={12} />
          Verify Cloud Status
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isAdmin ? "Ask a security question..." : "Enter Admin ID (e.g. admin@cloudguard.io)..."}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'white',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn btn-primary"
          style={{
            padding: '10px',
            borderRadius: '12px',
            opacity: (!input.trim() || loading) ? 0.5 : 1,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
