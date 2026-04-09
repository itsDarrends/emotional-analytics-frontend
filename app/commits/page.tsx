"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function Commits() {
  const [commits, setCommits] = useState([]);
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repoId");
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCommits = async () => {
      const token = await getToken();
      fetch(`http://localhost:8080/commits/${repoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setCommits(data));
    };
    fetchCommits();
  }, []);

  const getSentimentStyle = (label: string) => {
    if (label === 'POSITIVE') return { backgroundColor: '#dcfce7', color: '#16a34a' };
    if (label === 'NEGATIVE') return { backgroundColor: '#fee2e2', color: '#dc2626' };
    return { backgroundColor: '#f1f5f9', color: '#64748b' };
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '32px', padding: '0 8px' }}>
          Emotional Analytics
        </div>
        <nav>
          {['Dashboard', 'Repositories'].map(item => (
            <div key={item} onClick={() => router.push(`/${item.toLowerCase()}`)} style={{
              padding: '10px 12px',
              borderRadius: '6px',
              color: '#94a3b8',
              backgroundColor: 'transparent',
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
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', border: '1px solid #e2e8f0', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}>
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Commits</h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>{commits.length} commits analyzed</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['Commit Message', 'Author', 'Sentiment', 'Score', 'Date'].map(col => (
                    <th key={col} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commits.map((commit: any, index: number) => (
                  <tr key={commit.id} style={{ borderTop: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#0f172a', maxWidth: '400px' }}>{commit.message}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{commit.authorName}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ ...getSentimentStyle(commit.sentimentLabel), padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>
                        {commit.sentimentLabel}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{commit.sentimentScore}</td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{new Date(commit.committedAt).toLocaleDateString()}</td>
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