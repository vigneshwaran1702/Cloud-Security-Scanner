import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Zap,
  Lock,
  Cloud,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
  Terminal,
  Activity,
  AlertTriangle,
  Play,
  Check,
  ChevronRight,
  Sun,
  Moon,
  LogIn,
  UserPlus,
  Cpu,
  RefreshCw,
  Globe,
  Sliders,
  FileText,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const { user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [provider, setProvider] = useState('AWS');
  const [accountId, setAccountId] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Live simulation log states
  const [simLog, setSimLog] = useState([
    { type: 'info', text: 'Initializing CloudGuard AI engine...' },
    { type: 'success', text: 'Multi-cloud telemetry stream connected.' },
    { type: 'warn', text: 'Discovered 3 high-risk IAM wildcard permissions.' },
    { type: 'success', text: 'CIS Benchmark v8.0 audit completed (Score: 84%).' }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const handleStartAudit = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    const cleanId = accountId.trim() || (provider === 'AWS' ? '123456789012' : provider === 'AZURE' ? 'sub-prod-9941' : 'gcp-core-prod');
    setTimeout(() => {
      navigate('/dashboard', { state: { autoScan: true, targetId: cleanId, provider } });
    }, 600);
  };

  const capabilities = [
    {
      icon: Cloud,
      title: 'Multi-Cloud CSPM',
      desc: 'Unified security posture discovery and inventory tracking across AWS, Microsoft Azure, and Google Cloud Platform in real time.',
      badge: 'Multi-Cloud'
    },
    {
      icon: Sparkles,
      title: 'AI Root-Cause & Blast Radius',
      desc: 'Generative AI analyzes misconfigurations and maps out lateral movement risks before malicious actors exploit them.',
      badge: 'AI Powered'
    },
    {
      icon: Zap,
      title: '1-Click Autonomous Remediation',
      desc: 'Instantly patch open S3 buckets, unrestricted SSH/RDP ports, and overprivileged IAM roles with tested Terraform & CLI scripts.',
      badge: 'Instant Fix'
    },
    {
      icon: FileCheck,
      title: 'Continuous Compliance Engine',
      desc: 'Automated compliance auditing against CIS Benchmarks, SOC 2 Type II, HIPAA, NIST CSF, PCI-DSS v4.0, and GDPR.',
      badge: 'Audit Ready'
    },
    {
      icon: KeyRound,
      title: 'IAM & Zero-Trust Governance',
      desc: 'Detect shadow admin access, orphaned credentials, privilege escalation pathways, and enforce strict least privilege.',
      badge: 'Zero Trust'
    },
    {
      icon: Activity,
      title: 'Real-Time Threat Detection',
      desc: 'Continuous infrastructure drift monitoring with sub-second alert triggers, SIEM integration, and customizable webhooks.',
      badge: '24/7 Monitoring'
    }
  ];

  const frameworks = [
    { name: 'CIS Benchmarks v8.0', score: '94%', count: '74 Controls', status: 'Optimal' },
    { name: 'SOC 2 Type II', score: '98%', count: '48 Controls', status: 'Compliant' },
    { name: 'HIPAA Security Rule', score: '91%', count: '36 Controls', status: 'Passing' },
    { name: 'NIST CSF 2.0', score: '89%', count: '52 Controls', status: 'Monitored' },
    { name: 'PCI-DSS v4.0', score: '96%', count: '64 Controls', status: 'Certified' },
    { name: 'ISO/IEC 27001', score: '95%', count: '58 Controls', status: 'Verified' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--panel-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'var(--transition)'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px var(--primary-glow)'
          }}>
            <Shield size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="gradient-text">CloudGuard</span>
              <span style={{ fontSize: '0.72rem', background: 'var(--badge-primary-bg)', color: 'var(--badge-primary-color)', border: '1px solid var(--badge-primary-border)', padding: '2px 7px', borderRadius: '20px', fontWeight: 700 }}>AI 2.0</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cloud Security Posture Management</div>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '0.9rem', fontWeight: 500 }}>
          <a href="#capabilities" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>Capabilities</a>
          <a href="#simulator" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>Live Simulator</a>
          <a href="#compliance" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>Compliance</a>
          <a href="#how-it-works" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>How It Works</a>
          <Link to="/subscription" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Pricing</span>
            <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>PRO</span>
          </Link>
        </div>

        {/* Right CTA / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            style={{
              background: 'var(--panel-inner-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition)'
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={17} color="#fbbf24" /> : <Moon size={17} color="var(--primary)" />}
          </button>

          {user ? (
            <Link
              to="/dashboard"
              className="btn btn-primary"
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--primary-glow)'
              }}
            >
              <span>Command Center</span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '8px 14px',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogIn size={16} />
                <span>Sign In</span>
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px var(--primary-glow)'
                }}
              >
                <UserPlus size={16} />
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '70px 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Glow Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, var(--bg-gradient-1) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '880px', margin: '0 auto' }}>
          
          {/* Top Pill Announcement */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--badge-primary-bg)',
            border: '1px solid var(--badge-primary-border)',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--badge-primary-color)',
            marginBottom: '24px',
            boxShadow: '0 2px 10px var(--primary-glow)'
          }}>
            <Sparkles size={15} />
            <span>Autonomous Cloud Security Posture Management 2026</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>• Powered by Deep AI</span>
          </div>

          {/* Main Hero Headline */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            margin: '0 0 20px 0'
          }}>
            Continuous Multi-Cloud Security <br />
            <span className="gradient-text">Audited & Remediated in Real Time</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.22rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 36px auto'
          }}>
            Detect vulnerabilities, overprivileged IAM identities, public storage leaks, and compliance gaps across <strong>AWS</strong>, <strong>Azure</strong>, and <strong>GCP</strong>. Remediate threats with automated AI-generated patches.
          </p>

          {/* Quick Instant Audit Box */}
          <form onSubmit={handleStartAudit} style={{
            background: 'var(--panel-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            padding: '12px 14px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '680px',
            margin: '0 auto 36px auto',
            boxShadow: 'var(--glass-shadow-hover)',
            backdropFilter: 'blur(16px)'
          }}>
            {/* Provider Selector */}
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              style={{
                background: 'var(--input-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.9rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="AWS">AWS Account</option>
              <option value="AZURE">Azure Subscription</option>
              <option value="GCP">GCP Project</option>
            </select>

            {/* Cloud ID Input */}
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder={
                provider === 'AWS'
                  ? 'Enter 12-digit AWS Account ID (e.g. 123456789012)'
                  : provider === 'AZURE'
                  ? 'Enter Azure Subscription ID / Tenant GUID'
                  : 'Enter GCP Project ID (e.g. cloud-prod-2026)'
              }
              style={{
                flex: 1,
                minWidth: '220px',
                background: 'var(--input-bg)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />

            {/* Run Audit Button */}
            <button
              type="submit"
              disabled={isSimulating}
              className="btn btn-primary"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px var(--primary-glow)'
              }}
            >
              {isSimulating ? (
                <>
                  <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Launching Scan...</span>
                </>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Run Live Audit</span>
                </>
              )}
            </button>
          </form>

          {/* Security Trust Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '20px', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>Read-Only IAM Telemetry</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} color="var(--primary)" />
              <span>AES-256 Encrypted Session</span>
            </div>
            <span>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--accent)" />
              <span>Zero Agent Installation</span>
            </div>
          </div>
        </div>

        {/* 3. HERO LIVE TERMINAL & SCANNER PREVIEW */}
        <div id="simulator" style={{ marginTop: '56px' }}>
          <div className="glass-panel" style={{
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: 'var(--glass-shadow-hover)',
            background: 'var(--panel-bg-solid)'
          }}>
            {/* Terminal Window Header */}
            <div style={{
              background: 'var(--panel-inner-bg)',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={14} color="var(--primary)" />
                  <span>cloudguard-scanner // live-telemetry-engine</span>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>
                <span className="live-dot" />
                <span>ONLINE (ACTIVE DEFENSE)</span>
              </div>
            </div>

            {/* Terminal Content Grid */}
            <div style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              background: 'rgba(5, 8, 14, 0.95)'
            }}>
              {/* Left Column: Real-time Scanning Feed */}
              <div style={{
                background: 'rgba(10, 14, 22, 0.8)',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid var(--border-color)',
                fontFamily: 'monospace',
                fontSize: '0.84rem'
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  Live Telemetry Log
                </div>
                <div className="flex flex-col gap-2">
                  <div style={{ color: '#38bdf8' }}>[12:00:01] ⚡ Initiating asset discovery across AWS us-east-1 & Azure eastus2...</div>
                  <div style={{ color: '#10b981' }}>[12:00:03] ✔ 142 cloud resources mapped across 5 VPCs and 2 Subscriptions.</div>
                  <div style={{ color: '#f43f5e' }}>[12:00:05] ✖ CRITICAL: S3 Bucket "corp-analytics-prod" public read policy enabled!</div>
                  <div style={{ color: '#f97316' }}>[12:00:06] ✖ HIGH: EC2 Security Group 0.0.0.0/0 inbound SSH on port 22.</div>
                  <div style={{ color: '#818cf8' }}>[12:00:08] 🤖 AI Remediation: Terraform fix script generated automatically.</div>
                  <div style={{ color: '#10b981' }}>[12:00:10] ✔ Overall Cloud Security Score: 88/100 (CIS Benchmark Passing)</div>
                </div>
              </div>

              {/* Right Column: Key Metrics & Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px'
                }}>
                  <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Security Score</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>88 / 100</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>+14 pts from last scan</div>
                  </div>

                  <div style={{ background: 'var(--panel-inner-bg)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '14px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Risks</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--critical)', marginTop: '4px' }}>3 Open</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>1 Critical • 2 High</div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
                  border: '1px solid var(--border-color-hover)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>AI Auto-Remediation Ready</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Apply 1-click fixes for all open critical misconfigurations</div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="btn btn-primary"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>View Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY CAPABILITIES SECTION */}
      <section id="capabilities" style={{
        padding: '70px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--badge-primary-bg)',
              color: 'var(--badge-primary-color)',
              border: '1px solid var(--badge-primary-border)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              ENTERPRISE-GRADE CSPM
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
              Complete Cloud Posture & Threat Protection
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6 }}>
              CloudGuard AI unites multi-cloud discovery, identity intelligence, automated remediation, and continuous compliance into a single dashboard.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--panel-bg-solid)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)',
                    cursor: 'default'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.15))',
                        border: '1px solid var(--border-color-hover)',
                        padding: '12px',
                        borderRadius: '14px',
                        display: 'inline-flex',
                        color: 'var(--primary)'
                      }}>
                        <Icon size={24} />
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'var(--panel-inner-bg)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        padding: '4px 10px',
                        borderRadius: '12px'
                      }}>
                        {cap.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 10px 0', color: 'var(--text-main)' }}>
                      {cap.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                      {cap.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    <Link
                      to="/dashboard"
                      style={{
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Explore feature</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. COMPLIANCE BENCHMARKS SECTION */}
      <section id="compliance" style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--badge-primary-bg)',
            color: 'var(--badge-primary-color)',
            border: '1px solid var(--badge-primary-border)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '12px'
          }}>
            CONTINUOUS COMPLIANCE
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
            Audit-Ready Compliance Frameworks
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Map every cloud resource directly to regulatory frameworks with real-time pass/fail evidence and automated audit report generation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px'
        }}>
          {frameworks.map((fw, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                background: 'var(--panel-bg-solid)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{fw.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {fw.count} • Automated Daily Checks
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>{fw.score}</div>
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--success)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  display: 'inline-block',
                  marginTop: '2px'
                }}>
                  {fw.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS 3-STEP SECTION */}
      <section id="how-it-works" style={{
        padding: '70px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px auto' }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--badge-primary-bg)',
              color: 'var(--badge-primary-color)',
              border: '1px solid var(--badge-primary-border)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '12px'
            }}>
              RAPID DEPLOYMENT
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
              How CloudGuard AI Works in 3 Steps
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '20px', background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(99, 102, 241, 0.2)', marginBottom: '12px' }}>01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>Connect Your Cloud</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                Attach your AWS Cross-Account Role, Azure Service Principal, or GCP Service Account in under 60 seconds. Read-only and non-intrusive.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '20px', background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(6, 182, 212, 0.2)', marginBottom: '12px' }}>02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>AI Scans & Analyzes</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                Our deep scanner models analyze configurations, network attack vectors, excessive permissions, and unencrypted databases.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px 24px', borderRadius: '20px', background: 'var(--panel-bg-solid)', border: '1px solid var(--border-color)', position: 'relative' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(16, 185, 129, 0.2)', marginBottom: '12px' }}>03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 8px 0' }}>Auto-Remediate</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                Apply verified 1-click fixes or export Terraform and AWS CLI remediation commands to restore a 100% compliant security posture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.15))',
          border: '1px solid var(--border-color-hover)',
          borderRadius: '28px',
          padding: '48px 32px',
          textAlign: 'center',
          boxShadow: 'var(--glass-shadow-hover)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, margin: '0 0 14px 0' }}>
              Ready to Lock Down Your Cloud?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, margin: '0 0 28px 0' }}>
              Join forward-thinking cloud engineering and security teams. Launch your first comprehensive scan in 60 seconds.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px var(--primary-glow)'
                }}
              >
                <span>Create Free Account</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/dashboard"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textDecoration: 'none',
                  color: 'var(--text-main)',
                  background: 'var(--panel-inner-bg)',
                  border: '1px solid var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Explore Live Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer style={{
        marginTop: 'auto',
        background: 'var(--panel-bg-solid)',
        borderTop: '1px solid var(--border-color)',
        padding: '40px 24px 30px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} color="#ffffff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>CloudGuard AI</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>© 2026 AI Cloud Security Scanner. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Command Center</Link>
            <Link to="/resources" style={{ color: 'inherit', textDecoration: 'none' }}>Asset Inventory</Link>
            <Link to="/subscription" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
            <Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
