import { useState } from 'react';
import { Cloud, Shield, Server, Lock, ExternalLink, ArrowRight, CheckCircle2, BookOpen, Layers, X } from 'lucide-react';

export default function CloudflareLearningModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('what-is-cloud');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '24px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '36px',
          borderRadius: '24px',
          position: 'relative',
          background: 'var(--panel-bg-solid)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-main)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Cloudflare Badge */}
        <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
          <span style={{
            background: 'rgba(246, 130, 31, 0.15)',
            color: '#f6821f',
            border: '1px solid rgba(246, 130, 31, 0.3)',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <BookOpen size={13} /> CLOUDFLARE LEARNING CENTER
          </span>
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
          What is the Cloud? | Cloud Security Architecture
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '24px' }}>
          The 'cloud' refers to servers that are accessed over the Internet, and the software and databases that run on those servers. By using cloud computing, users and companies do not have to manage physical servers themselves or run software applications on their own machines.
        </p>

        {/* Topic Selector Tabs */}
        <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'what-is-cloud', label: '1. What is the Cloud?', icon: Cloud },
            { id: 'shared-responsibility', label: '2. Shared Responsibility', icon: Shield },
            { id: 'cloud-security', label: '3. Securing Cloud Workloads', icon: Lock },
          ].map(t => {
            const Icon = t.icon;
            const isTab = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className="btn"
                style={{
                  background: isTab ? '#f6821f' : 'var(--panel-inner-bg)',
                  color: isTab ? '#ffffff' : 'var(--text-main)',
                  border: isTab ? 'none' : '1px solid var(--border-color)',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        {activeTab === 'what-is-cloud' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '16px' }}>
              <div style={{ background: 'var(--panel-inner-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: '#f6821f', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>Infrastructure (IaaS)</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Virtual machines, compute instances, storage buckets, and networking (AWS EC2, Azure VMs, GCP Compute).</div>
              </div>
              <div style={{ background: 'var(--panel-inner-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>Platform (PaaS)</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Managed databases, Kubernetes clusters, and runtime environments (Cloud SQL, BigQuery, EKS).</div>
              </div>
              <div style={{ background: 'var(--panel-inner-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>Software (SaaS)</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Complete cloud-hosted software applications accessed through web browsers and APIs.</div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Cloud computing makes it possible for companies to scale globally in seconds without purchasing physical hardware. However, it introduces dynamic security challenges including misconfigured storage buckets, over-privileged IAM identities, and exposed ports.
            </p>
          </div>
        )}

        {activeTab === 'shared-responsibility' && (
          <div className="flex flex-col gap-4">
            <div style={{ background: 'var(--panel-inner-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>The Shared Responsibility Model</h4>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Cloud providers (AWS, Azure, GCP) are responsible for <strong>Security OF the Cloud</strong> (physical datacenters, virtualization layer, hardware). <strong>YOU are responsible for Security IN the Cloud</strong> (customer data, IAM roles, firewalls, and configuration posture).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.85rem' }}>Cloud Provider Responsibilities</div>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <li>Physical host hardware security</li>
                  <li>Hypervisor & virtualization isolation</li>
                  <li>Core cloud region infrastructure</li>
                </ul>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(246, 130, 31, 0.08)', border: '1px solid rgba(246, 130, 31, 0.25)' }}>
                <div style={{ fontWeight: 700, color: '#f6821f', fontSize: '0.85rem' }}>Your Security Responsibilities (CloudGuard AI)</div>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <li>IAM access keys and least-privilege policies</li>
                  <li>S3 / Blob public accessibility restrictions</li>
                  <li>Data encryption & network security groups</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cloud-security' && (
          <div className="flex flex-col gap-4">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              CloudGuard AI continuously monitors your verified cloud IDs to prevent data breaches, enforce CIS compliance benchmarks, and automatically remediate vulnerabilities across AWS, Azure, and Google Cloud.
            </p>
            <div className="flex items-center gap-3" style={{ marginTop: '8px' }}>
              <button
                onClick={onClose}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem', background: '#f6821f', borderColor: '#f6821f' }}
              >
                Launch Cloud Scan <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
