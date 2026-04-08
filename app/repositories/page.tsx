"use client"
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Repositories() {
        const [repos, setRepos] = useState([]);
        const { getToken } = useAuth();
        const router = useRouter();
        
        useEffect(() => {
                const fetchRepos = async () => {
                const token = await getToken();
                fetch("http://localhost:8080/repos", {
                        headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => setRepos(data));
        };
    fetchRepos();
  }, []);

  return (
  <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '32px', padding: '0 8px' }}>
          Emotional Analytics
        </div>
        <nav>
          {['Dashboard', 'Repositories', 'Reports', 'Settings'].map(item => (
            <div key={item} onClick={() => item === 'Dashboard' ? router.push('/dashboard') : null} style={{
              padding: '10px 12px',
              borderRadius: '6px',
              color: item === 'Repositories' ? 'white' : '#94a3b8',
              backgroundColor: item === 'Repositories' ? '#1e293b' : 'transparent',
              marginBottom: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              {item}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Repositories</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>All tracked repositories</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Name', 'Platform', 'GitHub URL', 'Created At', 'Action'].map(col => (
                    <th key={col} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repos.map((repo: any, index: number) => (
                  <tr key={repo.id} style={{ borderTop: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>{repo.name}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>
                        {repo.platform}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{repo.githubUrl}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{new Date(repo.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <button style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                        View Score
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}