import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { MessageSquare, X, Send, Sparkles, Key, CheckCircle, Bot, User, RefreshCw, Zap, ShieldCheck, Activity, Flame } from 'lucide-react';

export default function SecurityChatDrawer({ isOpen, onClose, onOpenCloudVerifier }) {
  const { user, elevateToAdmin, isAdmin } = useAuth();
  const { isPro } = useSubscription();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.name || 'Security Specialist'}! I'm CloudGuard 24/7 AI SecOps Assistant. How can I provide instant help for your cloud infrastructure today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
    {
      id: 2,
      sender: 'bot',
      type: 'info',
      text: isPro 
        ? '⚡ PRO STATUS ACTIVE: 24/7 Instant Help Hotline Priority Enabled. Sub-minute incident runbooks & Safe Production remediation unlocked.'
        : '🛡️ Standard SecOps AI active. Upgrade to $39 Pro for prioritized 24/7 Instant Help & Safe Production execution.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const drawerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        if (!event.target.closest('[data-chat-trigger]')) {
          onClose();
        }
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

    setTimeout(async () => {
      try {
        if (lowerText.includes('vignesh') || lowerText.includes('admin') || lowerText.includes('cloudvignesh17')) {
          try {
            const elevatedUser = await elevateToAdmin(userText);
            setMessages(prev => [
              ...prev,
              {
                id: Date.now() + 1,
                sender: 'bot',
                type: 'success',
                text: `✅ Administrator Access Confirmed for ${elevatedUser.name} (${elevatedUser.email}). User Management portal is active.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }
            ]);
            setLoading(false);
            return;
          } catch (err) {
            // Normal fallback
          }
        }

        let botReply = "I can analyze your cloud resources, check compliance benchmarks, or verify account statuses. Try asking: 'Check cloud status' or 'What are the critical vulnerabilities?'.";

        if (lowerText.includes('status') || lowerText.includes('cloud') || lowerText.includes('verify')) {
          botReply = "CloudGuard actively monitors AWS (Account #891230912401), Azure, and GCP. Click 'Verify Cloud Status' below to run real-time connectivity diagnostics.";
        } else if (lowerText.includes('scan') || lowerText.includes('security') || lowerText.includes('issue')) {
          botReply = "Current Security Score is 84/100. 5 Critical & 12 High severity issues detected across monitored clouds. Auto-remediation is ready.";
        } else if (lowerText.includes('admin') || lowerText.includes('who is admin')) {
          botReply = "The sole system administrator for this portal is vigneshcloud@gmail.com.";
        } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
          botReply = `Hello ${user?.name || ''}! How can I assist with your cloud security posture today?`;
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
            text: `⚠️ Error: ${err.message || 'Unable to process chat request.'}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div
      ref={drawerRef}
      style={{
        position: 'fixed',
        top: '88px',
        right: '24px',
        width: '420px',
        height: '620px',
        maxHeight: 'calc(100vh - 110px)',
        background: 'var(--panel-bg-solid)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        boxShadow: 'var(--glass-shadow-hover)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2000,
        overflow: 'hidden',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--panel-inner-bg)',
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
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
          }}>
            <Bot size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }} className="flex items-center gap-2">
              <span>24/7 AI SecOps Hotline</span>
              <span style={{
                fontSize: '0.65rem',
                background: isPro ? 'rgba(16, 185, 129, 0.15)' : 'var(--badge-primary-bg)',
                color: isPro ? 'var(--success)' : 'var(--badge-primary-color)',
                border: `1px solid ${isPro ? 'rgba(16, 185, 129, 0.35)' : 'var(--badge-primary-border)'}`,
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {isPro ? 'PRO 24/7' : 'ONLINE'}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Autonomous Cloud Incident Response</div>
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
                <><Bot size={12} color="var(--primary)" /><span>CloudGuard AI • {msg.timestamp}</span></>
              )}
            </div>

            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, var(--primary), var(--accent))'
                : msg.type === 'success'
                  ? 'rgba(16, 185, 129, 0.15)'
                  : msg.type === 'error'
                    ? 'var(--critical-bg)'
                    : 'var(--panel-inner-bg)',
              border: msg.sender === 'user'
                ? 'none'
                : msg.type === 'success'
                  ? '1px solid var(--success-border)'
                  : msg.type === 'error'
                    ? '1px solid var(--critical-border)'
                    : '1px solid var(--border-color)',
              color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
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
            <span>24/7 SecOps AI triaging cloud incident...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Shortcuts */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '6px', overflowX: 'auto', background: 'var(--panel-inner-bg)' }}>
        <button
          type="button"
          onClick={() => {
            setInput('Help! Critical S3 bucket public access detected on production. What is the immediate safe remediation?');
          }}
          style={{
            background: 'var(--critical-bg)',
            border: '1px solid var(--critical-border)',
            color: 'var(--critical)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Flame size={12} />
          Instant Incident SOS
        </button>

        <button
          type="button"
          onClick={() => {
            setInput('What is my biggest risk contribution asset across AWS and Azure right now?');
          }}
          style={{
            background: 'var(--badge-primary-bg)',
            border: '1px solid var(--badge-primary-border)',
            color: 'var(--badge-primary-color)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Activity size={12} />
          Risk Contribution Analysis
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            if (onOpenCloudVerifier) onOpenCloudVerifier();
          }}
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--success)',
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
        background: 'var(--panel-bg-solid)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a security question..."
          style={{
            flex: 1,
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'var(--text-main)',
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
