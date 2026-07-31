import { ShieldAlert, Server, AlertTriangle, CheckCircle, Activity, Box } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', score: 72 },
  { name: 'Tue', score: 75 },
  { name: 'Wed', score: 71 },
  { name: 'Thu', score: 78 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 84 },
  { name: 'Sun', score: 84 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Security Score</span>
            <Activity size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--success)' }}>84<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/100</span></div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>+4% since last scan</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Total Resources</span>
            <Server size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>356</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Across 2 clouds</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Critical Issues</span>
            <ShieldAlert size={20} color="var(--critical)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--critical)' }}>5</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--critical)', marginTop: '8px' }}>Requires immediate action</div>
        </div>

        <div className="glass-panel flex flex-col justify-between" style={{ padding: '24px' }}>
          <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>High Issues</span>
            <AlertTriangle size={20} color="var(--high)" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--high)' }}>12</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Schedule for next sprint</div>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        
        {/* Chart Area */}
        <div className="glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Security Posture Trend</h3>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Area */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Compliance Check</h3>
          
          <div className="flex flex-col gap-4">
            {/* CIS */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>CIS</span>
                <span style={{ color: 'var(--medium)', fontWeight: 600 }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'var(--medium)' }}></div>
              </div>
            </div>

            {/* PCI DSS */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>PCI DSS</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>91%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '91%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>

            {/* NIST */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
                <span style={{ fontWeight: 600 }}>NIST</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>88%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-panel" style={{ marginTop: '8px' }}>
        <h3 className="gradient-text" style={{ marginBottom: '24px', fontSize: '1.4rem' }}>AI Security Recommendations</h3>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '24px', borderRadius: '16px', borderLeft: '4px solid var(--critical)' }}>
          <div className="flex justify-between items-start" style={{ marginBottom: '16px' }}>
            <div className="flex items-center gap-3">
              <Box color="var(--critical)" size={24} />
              <h4 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)' }}>Public S3 Bucket Detected</h4>
            </div>
            <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--critical)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>Critical</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Risk Analysis</p>
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                The S3 Bucket <strong>`customer-data-prod`</strong> is publicly accessible. Anyone on the internet can read confidential files.
              </p>
              <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px', paddingLeft: '20px', lineHeight: 1.6 }}>
                <li>Customer data leakage</li>
                <li>Financial penalties & Compliance violations</li>
              </ul>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600 }}>Recommended Fix</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3" style={{ fontSize: '0.9rem' }}>
                  <CheckCircle size={16} color="var(--primary)" /> <span>Disable public access block at account level</span>
                </div>
                <div className="flex items-center gap-3" style={{ fontSize: '0.9rem' }}>
                  <CheckCircle size={16} color="var(--primary)" /> <span>Enable default KMS encryption</span>
                </div>
                <div className="flex items-center gap-3" style={{ fontSize: '0.9rem' }}>
                  <CheckCircle size={16} color="var(--primary)" /> <span>Restrict bucket policy to VPC only</span>
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }}>Apply Fix Automatically</button>
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
