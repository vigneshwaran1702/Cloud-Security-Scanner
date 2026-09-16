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
  LogIn,
  UserPlus,
  Cpu,
  RefreshCw,
  Globe,
  Sliders,
  FileText,
  KeyRound,
  FileCheck,
  Search,
  MessageCircle,
  Mail,
  Compass,
  CheckCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WorldAnimation from '../components/WorldAnimation';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState('AWS');
  const [accountId, setAccountId] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeMethodPhase, setActiveMethodPhase] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const handleStartAudit = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    const cleanId = accountId.trim() || (provider === 'AWS' ? '123456789012' : provider === 'AZURE' ? 'sub-prod-9941' : 'gcp-core-prod');
    setTimeout(() => {
      navigate('/dashboard', { state: { autoScan: true, targetId: cleanId, provider } });
    }, 600);
  };

  const reviews = [
    {
      source: 'google reviews',
      rating: '★★★★★',
      quote: 'Mientras otras empresas nos presentaban altísimas cotizaciones con herramientas genéricas, CloudGuard se destacó por reorientar una estrategia a la medida de nuestra nube. Ampliamente los recomiendo.',
      author: 'VP of Engineering, Global SaaS'
    },
    {
      source: 'trustindex',
      rating: '★★★★★',
      quote: 'Carlos and the CloudGuard team are on top of everything. Incredibly attentive and always reachable. Best cloud security audit experience we have ever had.',
      author: 'Lead DevOps Architect, Retail & E-commerce'
    },
    {
      source: 'google reviews',
      rating: '★★★★★',
      quote: 'Excelente servicio: detectaron 3 rutas críticas de escalamiento de privilegios IAM en nuestro primer escaneo. El script de Terraform automatizado nos ahorró semanas de trabajo manual.',
      author: 'Chief Security Officer, Fintech'
    },
    {
      source: 'trustindex',
      rating: '★★★★★',
      quote: 'De no tener visibilidad en nuestros 5 clusters de Kubernetes y buckets S3, ahora tenemos compliance continuo 24/7 sin instalar un solo agente. Una solución 100% amigable y potente.',
      author: 'Director of Cloud Infrastructure, Logistics'
    },
    {
      source: 'google reviews',
      rating: '★★★★★',
      quote: 'What an amazing platform. They audited our multi-cloud setup across AWS and Azure. Professional, fast, and easy to communicate with. 100% compliant in SOC 2 on our first attempt.',
      author: 'CTO, Healthcare Technology'
    }
  ];

  const methodPhases = [
    {
      num: '01',
      title: 'Discover',
      headline: '80% of cloud breaches happen because no one mapped the shadow assets.',
      bullets: [
        'we don\'t start at the patch. we start at the uncomfortable truth',
        'how your multi-cloud actually runs — not the architecture diagram version',
        'clarity before code'
      ],
      color: '#e4007c'
    },
    {
      num: '02',
      title: 'Diagnose',
      headline: 'If it can\'t be measured, it doesn\'t exist.',
      bullets: [
        'every friction, open S3 bucket, and silent IAM leak — mapped',
        'an executive diagnosis few security consultants will sign their name to',
        'quantified truth. zero opinions.'
      ],
      color: '#7c5bff'
    },
    {
      num: '03',
      title: 'Design',
      headline: 'We don\'t prescribe alerts. We prescribe outcomes.',
      bullets: [
        'every architectural decision tied to zero-trust & compliance KPIs',
        'if it doesn\'t move the needle, it doesn\'t make the plan',
        'blueprint, not buzzwords'
      ],
      color: '#06b6d4'
    },
    {
      num: '04',
      title: 'Deliver',
      headline: 'Code without adoption is debt with ego.',
      bullets: [
        'victory isn\'t alert notifications. it\'s your team running safe infrastructure without friction',
        '1-click verified Terraform and CLI patches shipped automatically',
        'adoption, not just delivery'
      ],
      color: '#10b981'
    },
    {
      num: '05',
      title: 'Evolve',
      headline: 'What doesn\'t evolve is already dying.',
      bullets: [
        'while most security vendors invoice and disappear, we stay',
        'your cloud footprint changes every sprint — your defense has to match',
        'partnership, not project'
      ],
      color: '#f97316'
    }
  ];

  const servicesCategories = [
    {
      category: 'Cloud & Infrastructure',
      services: [
        { title: 'Multi-Cloud CSPM', desc: 'Unified security posture discovery and inventory tracking across AWS, Azure, and GCP.', tag: 'Popular', link: '/dashboard' },
        { title: 'Public Bucket & Storage Guard', desc: 'Continuous zero-day detection of public S3 buckets, Azure Blobs, and GCS storage.', tag: 'Popular', link: '/resources' },
        { title: 'Kubernetes & Container Security', desc: 'Real-time auditing of EKS, AKS, and GKE configurations and network policies.', tag: '✦AI-First', link: '/dashboard' },
        { title: 'Network & Security Group Hardening', desc: 'Detect unrestricted 0.0.0.0/0 SSH, RDP, and database ports before attackers scan them.', tag: 'Essential', link: '/dashboard' },
        { title: 'Legacy Modernization', desc: 'Migrate off unmonitored legacy VPC architectures without rip-and-replace risk.', tag: '', link: '/settings' }
      ]
    },
    {
      category: 'Cloud, Data & AI',
      services: [
        { title: 'AI Autonomous Remediation✦', desc: 'Tested Terraform and AWS CLI fixes generated automatically and applied in 1 click.', tag: '✦100% AI', link: '/dashboard' },
        { title: 'Blast Radius & Attack Path AI✦', desc: 'Generative AI graphs lateral jump possibilities before malicious actors exploit them.', tag: 'Popular', link: '/dashboard' },
        { title: 'Continuous Drift Monitoring', desc: 'Detect unauthorized infrastructure mutations within seconds via sub-second webhooks.', tag: '24/7 Live', link: '/dashboard' },
        { title: 'Data Store Encryption Audit', desc: 'Audit KMS encryption, TLS enforcement, and unencrypted databases across all regions.', tag: '', link: '/resources' },
        { title: 'Cloud Migration Assurance', desc: 'Move on-prem workloads to AWS, Azure, or GCP with zero security regressions.', tag: '', link: '/settings' }
      ]
    },
    {
      category: 'Identity & Zero Trust',
      services: [
        { title: 'IAM Wildcard & Privilege Check✦', desc: 'Identify shadow admins, orphaned access keys, and excessive wildcard permissions.', tag: '✦Zero-Trust', link: '/dashboard' },
        { title: 'Privilege Escalation Intercept', desc: 'Map multi-hop IAM permission escalation pathways and enforce least privilege.', tag: 'Popular', link: '/dashboard' },
        { title: 'Cross-Account Role Governance', desc: 'Audit assume-role policies, external trust relationships, and vendor access.', tag: '', link: '/settings' }
      ]
    },
    {
      category: 'Growth & Compliance',
      services: [
        { title: 'CIS Benchmarks v8.0', desc: 'Automated 74-point CIS multi-cloud compliance scoring with evidence exports.', tag: 'Popular', link: '/dashboard' },
        { title: 'SOC 2 Type II Readiness✦', desc: 'Continuous evidence gathering across 48 security controls for clean audits.', tag: 'Audit-Ready', link: '/dashboard' },
        { title: 'HIPAA, PCI-DSS & NIST CSF', desc: 'Turn complex regulatory mandates into actionable pass/fail posture dashboards.', tag: 'Certified', link: '/dashboard' }
      ]
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
    <div style={{ minHeight: '100vh', background: 'transparent', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP NAVIGATION BAR (WeEvolveIT Style) */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(23, 23, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'var(--transition)'
      }}>
        {/* Brand Logo & Editorial Wordmark */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <img
            src="/logo.png"
            alt="CloudGuard Logo"
            style={{
              width: '34px',
              height: '34px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px var(--primary-glow))'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.18rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              CloudGuard
            </span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
              . evolved
            </span>
          </div>
        </Link>

        {/* Center Editorial Lowercase Nav Links */}
        <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.88rem', fontWeight: 500 }}>
          <a href="#services" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', transition: 'var(--transition)' }}>
            services<span style={{ fontSize: '0.65rem' }}>▾</span>
          </a>
          <a href="#method" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>
            the 5 method
          </a>
          <a href="#tools" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', transition: 'var(--transition)' }}>
            free tools<span style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>✦</span>
          </a>
          <a href="#compliance" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>
            compliance
          </a>
          <a href="#simulator" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'var(--transition)' }}>
            live terminal
          </a>
          <Link to="/subscription" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>pricing</span>
            <span style={{ fontSize: '0.68rem', background: 'rgba(228, 0, 124, 0.15)', color: 'var(--primary)', padding: '1px 6px', borderRadius: '999px', fontWeight: 700 }}>PRO</span>
          </Link>
        </div>

        {/* Right CTA / Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <Link
              to="/dashboard"
              className="evolve-pill-btn evolve-pill-btn-primary"
              style={{ fontSize: '0.84rem', padding: '8px 18px' }}
            >
              <span>Command Center</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>sign in</span>
              </Link>

              <a
                href="#audit-tool"
                className="evolve-pill-btn evolve-pill-btn-primary"
                style={{ fontSize: '0.84rem', padding: '8px 18px' }}
              >
                <span>run free audit</span>
                <span style={{ fontSize: '0.9rem' }}>→</span>
              </a>
            </>
          )}
        </div>
      </nav>

      {/* 2. HERO SECTION (WeEvolveIT Style - Centered, Spacious & Elegant) */}
      <section style={{
        position: 'relative',
        padding: '70px 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        {/* Glow Background Accent */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(228, 0, 124, 0.22) 0%, rgba(124, 91, 255, 0.12) 50%, rgba(0,0,0,0) 75%)',
          filter: 'blur(90px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Top Pill Announcement with Star */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--badge-primary-bg)',
            border: '1px solid var(--badge-primary-border)',
            padding: '7px 22px',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: 'var(--badge-primary-color)',
            marginBottom: '26px',
            boxShadow: '0 2px 16px var(--primary-glow)'
          }}>
            <span style={{ color: 'var(--primary)' }}>✦</span>
            <span>your cloud security partner. evolved.</span>
            <span style={{ opacity: 0.35 }}>|</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>MULTI-CLOUD CSPM</span>
          </div>

          {/* Main Hero Headline (Editorial WeEvolveIT Style) */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
            fontWeight: 850,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            margin: '0 0 24px 0',
            textTransform: 'lowercase'
          }}>
            your cloud security partner. <br />
            <span className="evolve-gradient-text">evolved.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.02rem, 1.8vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.7,
            maxWidth: '720px',
            margin: '0 auto 36px auto'
          }}>
            AI specialists. A five-phase method — <strong style={{ color: 'var(--text-main)' }}>Discover</strong>, <strong style={{ color: 'var(--text-main)' }}>Diagnose</strong>, <strong style={{ color: 'var(--text-main)' }}>Design</strong>, <strong style={{ color: 'var(--text-main)' }}>Deliver</strong>, <strong style={{ color: 'var(--text-main)' }}>Evolve</strong> — that transforms how your business runs on the cloud. Multi-cloud telemetry across AWS, Azure & GCP with zero agents required.
          </p>

          {/* Quick Instant Audit Box (WeEvolveIT Diagnostic Pill) */}
          <div id="audit-tool" style={{ width: '100%', maxWidth: '740px', marginBottom: '28px' }}>
            <form onSubmit={handleStartAudit} className="evolve-audit-form">
              {/* Provider Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={16} color="var(--primary)" />
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  style={{
                    background: 'transparent',
                    color: 'var(--text-main)',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px 4px 0',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="AWS" style={{ background: '#1c1c1c' }}>AWS Account</option>
                  <option value="AZURE" style={{ background: '#1c1c1c' }}>Azure Subscription</option>
                  <option value="GCP" style={{ background: '#1c1c1c' }}>GCP Project</option>
                </select>
              </div>

              <div className="audit-divider" style={{ width: '1px', height: '24px', background: 'var(--border-color)' }} />

              {/* Cloud ID Input */}
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder={
                  provider === 'AWS'
                    ? '12-digit AWS Account ID (e.g. 123456789012)'
                    : provider === 'AZURE'
                    ? 'Azure Subscription ID / Tenant GUID'
                    : 'GCP Project ID (e.g. cloud-prod-2026)'
                }
                style={{
                  flex: 1,
                  minWidth: '220px',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none',
                  padding: '6px 8px'
                }}
              />

              {/* Run Audit Button */}
              <button
                type="submit"
                disabled={isSimulating}
                className="evolve-pill-btn evolve-pill-btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>diagnosing...</span>
                  </>
                ) : (
                  <>
                    <span>diagnose friction</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Metrics Trust Bar */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.02em',
            background: 'rgba(23, 23, 23, 0.65)',
            border: '1px solid var(--border-color)',
            padding: '9px 24px',
            borderRadius: '9999px',
            backdropFilter: 'blur(12px)'
          }}>
            <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>183+</span>
            <span>frictions diagnosed</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>99.8%</span>
            <span>compliance</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>17</span>
            <span>frameworks</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span style={{ color: 'var(--success)', fontWeight: 700 }}>0</span>
            <span>agents required</span>
          </div>
        </div>
      </section>

      {/* 3. INFINITE REVIEWS & TRUST MARQUEE (WeEvolveIT Signature) */}
      <section style={{
        padding: '30px 0',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'rgba(20, 20, 20, 0.6)'
      }}>
        <div className="evolve-marquee-container">
          <div className="evolve-marquee-track">
            {[...reviews, ...reviews].map((rev, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--panel-bg-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '18px 24px',
                  width: '380px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {rev.source}
                  </span>
                  <span style={{ color: '#fbbf24', fontSize: '0.9rem', letterSpacing: '2px' }}>
                    {rev.rating}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;{rev.quote}&rdquo;
                </p>
                <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 600, marginTop: 'auto' }}>
                  — {rev.author}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. "THE 5 METHOD" SECTION (Signature WeEvolveIT Framework) */}
      <section id="method" style={{
        padding: '90px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 56px auto' }}>
          <div className="evolve-mono-badge" style={{ marginBottom: '16px' }}>
            <span>✦ THE 5 METHOD</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 16px 0' }}>
            Technology accelerates faster every day. <br />
            <span className="evolve-gradient-text">We bend the curve.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.65 }}>
            Cloud infrastructure expands faster than security teams can keep up. We're the AI specialists who close that gap — a five-phase method that doesn't follow the curve, it bends it. No limits. No legacy. No excuses.
          </p>
          <div style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '0.88rem',
            color: 'var(--primary)',
            fontWeight: 700,
            marginTop: '16px',
            letterSpacing: '0.05em'
          }}>
            Discover · Diagnose · Design · Deliver · Evolve
          </div>
        </div>

        {/* 5-Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}>
          {methodPhases.map((phase, idx) => (
            <div
              key={idx}
              className="evolve-card"
              style={{
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                fontFamily: 'JetBrains Mono',
                color: phase.color,
                opacity: 0.85,
                lineHeight: 1,
                marginBottom: '14px'
              }}>
                {phase.num}
              </div>
              <h3 style={{
                fontSize: '1.28rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: '0 0 10px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>{phase.title}</span>
              </h3>
              <div style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                lineHeight: 1.45,
                marginBottom: '16px'
              }}>
                {phase.headline}
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '16px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {phase.bullets.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. "TEST YOUR CLOUD · FREE, NO SIGNUP" (WeEvolveIT Interactive Tools) */}
      <section id="tools" style={{
        padding: '70px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <div className="evolve-mono-badge" style={{ marginBottom: '12px' }}>
              <span>✦ INSTANT AUDIT TOOLS</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px 0' }}>
              Test your cloud · free, no signup
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
              Run instant diagnostics across key security vectors with zero credentials stored.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {/* Tool 1 */}
            <div className="evolve-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ color: 'var(--primary)', background: 'rgba(228, 0, 124, 0.1)', padding: '10px', borderRadius: '12px' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <span className="evolve-mono-badge" style={{ color: 'var(--primary)' }}>✦POPULAR</span>
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                  Cloud Health Diagnosis✦
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Where cloud misconfigurations are costing your business — an AI-powered diagnostic posture scan across CIS Benchmarks.
                </p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link
                  to="/dashboard"
                  className="evolve-pill-btn evolve-pill-btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem' }}
                >
                  <span>Start Diagnosis</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="evolve-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ color: 'var(--accent)', background: 'rgba(124, 91, 255, 0.1)', padding: '10px', borderRadius: '12px' }}>
                    <KeyRound size={22} />
                  </div>
                  <span className="evolve-mono-badge" style={{ color: 'var(--accent)' }}>✦ZERO-TRUST</span>
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                  IAM Visibility & Privilege Check✦
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Do wildcard permissions and orphan keys leave your accounts vulnerable to lateral jump? Find out in 30 seconds.
                </p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link
                  to="/dashboard"
                  className="evolve-pill-btn evolve-pill-btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem' }}
                >
                  <span>Check IAM Privileges</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="evolve-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '10px', borderRadius: '12px' }}>
                    <Cloud size={22} />
                  </div>
                  <span className="evolve-mono-badge" style={{ color: 'var(--success)' }}>INSTANT</span>
                </div>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 700, margin: '0 0 8px 0' }}>
                  Free S3 & Storage Leak Scan
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Instant security health scan detecting open S3 buckets, unrestricted blob ACLs, and public endpoint exposures.
                </p>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Link
                  to="/resources"
                  className="evolve-pill-btn evolve-pill-btn-outline"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.84rem' }}
                >
                  <span>Scan Storage Assets</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SERVICES DIRECTORY (WeEvolveIT Categorized Layout) */}
      <section id="services" style={{
        padding: '90px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '16px' }}>
          <div>
            <div className="evolve-mono-badge" style={{ marginBottom: '12px' }}>
              <span>✦ 100% AI SERVICES</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Services & Capabilities
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', marginTop: '8px', maxWidth: '600px' }}>
              And every service we deliver runs on an AI-driven process — AI is built into how we protect your cloud.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="evolve-pill-btn evolve-pill-btn-outline"
            style={{ fontSize: '0.84rem' }}
          >
            <span>All capabilities</span>
            <span>→→</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {servicesCategories.map((cat, idx) => (
            <div
              key={idx}
              className="evolve-card"
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                marginBottom: '16px',
                paddingBottom: '10px',
                borderBottom: '1px solid var(--border-color)'
              }}>
                {cat.category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cat.services.map((srv, sIdx) => (
                  <Link
                    key={sIdx}
                    to={srv.link}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-main)' }}>
                        {srv.title}
                      </span>
                      {srv.tag && (
                        <span style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: '0.68rem',
                          color: srv.tag.includes('AI') ? 'var(--primary)' : 'var(--text-muted)',
                          background: srv.tag.includes('AI') ? 'rgba(228, 0, 124, 0.1)' : 'var(--panel-inner-bg)',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {srv.tag}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.45 }}>
                      {srv.desc}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LIVE TELEMETRY SIMULATOR TERMINAL */}
      <section id="simulator" style={{
        padding: '70px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px auto' }}>
            <div className="evolve-mono-badge" style={{ marginBottom: '12px' }}>
              <span>✦ ACTIVE DEFENSE ENGINE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 10px 0' }}>
              Live Telemetry & Autonomous Remediator
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem' }}>
              Simulate cloud telemetry streams and autonomous Terraform fix generation in real time.
            </p>
          </div>

          {/* Terminal Box */}
          <div style={{
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.9)',
            background: '#0e0e0e'
          }}>
            {/* Terminal Header */}
            <div style={{
              background: '#161616',
              padding: '12px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#eab308' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.78rem', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  cloudguard-scanner // telemetry.live-stream.ai
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', boxShadow: '0 0 8px var(--primary)' }} />
                <span>ONLINE · SUB-SECOND MONITORING</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div style={{
              padding: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
              alignItems: 'center'
            }}>
              {/* Left Column: Interactive 3D Multi-Cloud Telemetry Radar */}
              <div style={{
                background: 'rgba(5, 5, 5, 0.9)',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    // 3D Telemetry Radar
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                    ✦ 10 Regions Live
                  </span>
                </div>
                <WorldAnimation />
              </div>

              {/* Right Column: Event Stream Logs & Score Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Event Stream Logs */}
                <div style={{
                  background: 'rgba(5, 5, 5, 0.9)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.82rem',
                  lineHeight: 1.6
                }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.74rem', textTransform: 'uppercase' }}>
                    // Real-time Event Stream
                  </div>
                  <div style={{ color: '#38bdf8' }}>[12:00:01] ⚡ Telemetry listener active on AWS us-east-1 & Azure eastus2...</div>
                  <div style={{ color: '#10b981' }}>[12:00:03] ✔ 142 cloud resources inventoried across 5 VPCs.</div>
                  <div style={{ color: '#f43f5e' }}>[12:00:05] ✖ CRITICAL: S3 Bucket &ldquo;corp-analytics-prod&rdquo; public read policy enabled!</div>
                  <div style={{ color: '#f97316' }}>[12:00:06] ✖ HIGH: EC2 Security Group 0.0.0.0/0 inbound SSH port 22 open.</div>
                  <div style={{ color: 'var(--primary)' }}>[12:00:08] ✦ AI Autonomous Fix: Terraform patch prepared & verified.</div>
                  <div style={{ color: '#10b981' }}>[12:00:10] ✔ CIS Benchmark Score: 94% (Grade A - Optimal)</div>
                </div>

                {/* Score & Action Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#141414', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Security Posture</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--success)', marginTop: '4px' }}>94 / 100</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>+12 pts from last scan</div>
                  </div>
                  <div style={{ background: '#141414', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Frictions Mapped</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>2 Open</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>1 Critical • 1 High</div>
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, rgba(228, 0, 124, 0.12), rgba(124, 91, 255, 0.08))',
                  border: '1px solid var(--border-color-hover)',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>Autonomous Remediation Ready✦</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Apply 1-click patches for all open critical frictions</div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="evolve-pill-btn evolve-pill-btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                  >
                    <span>View Portal</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPLIANCE FRAMEWORKS SECTION */}
      <section id="compliance" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 44px auto' }}>
          <div className="evolve-mono-badge" style={{ marginBottom: '12px' }}>
            <span>✦ CONTINUOUS COMPLIANCE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
            Audit-Ready Compliance Benchmarks
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
            Map every cloud asset directly to regulatory frameworks with real-time pass/fail evidence and automated audit report generation.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {frameworks.map((fw, i) => (
            <div
              key={i}
              className="evolve-card"
              style={{
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{fw.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {fw.count} • Automated Daily Audits
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'JetBrains Mono' }}>{fw.score}</div>
                <div style={{
                  fontSize: '0.7rem',
                  fontFamily: 'JetBrains Mono',
                  fontWeight: 700,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--success)',
                  padding: '2px 8px',
                  borderRadius: '999px',
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

      {/* 9. "WHAT'S SLOWING YOU DOWN?" (WeEvolveIT Signature CTA) */}
      <section style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(228, 0, 124, 0.15), rgba(124, 91, 255, 0.1))',
          border: '1px solid var(--border-color-hover)',
          borderRadius: '24px',
          padding: '56px 36px',
          textAlign: 'center',
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.85), 0 0 30px var(--primary-glow)',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div className="evolve-mono-badge" style={{ marginBottom: '16px' }}>
              <span>183 · FRICTIONS DIAGNOSED</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 14px 0' }}>
              What's slowing you down?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', lineHeight: 1.6, margin: '0 0 32px 0' }}>
              You name the friction. We map the fix. See what happens next...
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <Link
                to="/register"
                className="evolve-pill-btn evolve-pill-btn-primary"
                style={{ padding: '14px 30px', fontSize: '0.96rem' }}
              >
                <span>Create Free Account</span>
                <span>→</span>
              </Link>

              <Link
                to="/dashboard"
                className="evolve-pill-btn evolve-pill-btn-outline"
                style={{ padding: '14px 30px', fontSize: '0.96rem' }}
              >
                <span>Explore Live Demo</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EDITORIAL MINIMALIST FOOTER (WeEvolveIT Style) */}
      <footer style={{
        marginTop: 'auto',
        background: '#121212',
        borderTop: '1px solid var(--border-color)',
        padding: '60px 24px 30px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '36px',
          marginBottom: '48px'
        }}>
          {/* Col 1: Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <img src="/logo.png" alt="CloudGuard" style={{ width: '28px', height: '28px' }} />
              <span style={{ fontWeight: 800, fontSize: '1.08rem' }}>CloudGuard</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6 }}>
              AI specialists. A five-phase method — Discover, Diagnose, Design, Deliver, Evolve — that transforms how your business runs on the cloud.
            </p>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.74rem', color: 'var(--primary)', marginTop: '14px' }}>
              ✦ 100% AI services · built to evolve
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>
              Popular services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Multi-Cloud CSPM</Link>
              <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>AI Autonomous Remediation✦</Link>
              <Link to="/resources" style={{ color: 'inherit', textDecoration: 'none' }}>IAM Privilege Check✦</Link>
              <Link to="/resources" style={{ color: 'inherit', textDecoration: 'none' }}>Public S3 Bucket Scanner</Link>
              <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>CIS Benchmarks v8.0</Link>
            </div>
          </div>

          {/* Col 3: Company */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>
              Company
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Services</a>
              <a href="#method" style={{ color: 'inherit', textDecoration: 'none' }}>The 5 Method</a>
              <a href="#compliance" style={{ color: 'inherit', textDecoration: 'none' }}>Compliance Standards</a>
              <Link to="/subscription" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing Plans</Link>
              <Link to="/settings" style={{ color: 'inherit', textDecoration: 'none' }}>Settings & Accounts</Link>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-main)', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>
              Quick links
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              <a href="#audit-tool" style={{ color: 'inherit', textDecoration: 'none' }}>Cloud Health Diagnosis✦</a>
              <a href="#tools" style={{ color: 'inherit', textDecoration: 'none' }}>IAM Wildcard Check✦</a>
              <a href="#tools" style={{ color: 'inherit', textDecoration: 'none' }}>Free S3 Leak Scan</a>
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Sign In</Link>
              <Link to="/register" style={{ color: 'inherit', textDecoration: 'none' }}>Create Account</Link>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © 2026 CloudGuard® — registered trademark · built to evolve
          </div>
          <div style={{ display: 'flex', gap: '18px' }}>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms & Conditions</span>
            <span>·</span>
            <span>Security Statement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
