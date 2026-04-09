"use client"
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ width: '240px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '32px', padding: '0 8px' }}>
          Emotional Analytics
        </div>
        <nav>
          {['Dashboard', 'Repositories', 'Reports', 'Settings'].map(item => (
            <div key={item} onClick={() => router.push(`/${item.toLowerCase()}`)} style={{
              padding: '10px 12px', borderRadius: '6px',
              color: item === 'Settings' ? 'white' : '#94a3b8',
              backgroundColor: item === 'Settings' ? '#1e293b' : 'transparent',
              marginBottom: '4px', fontSize: '14px', cursor: 'pointer'
            }}>
              {item}
            </div>
          ))}
        </nav>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Settings</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>Manage your preferences</p>
        </div>
        <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>Coming Soon</p>
            <p style={{ fontSize: '14px' }}>Account settings and preferences will be available here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}