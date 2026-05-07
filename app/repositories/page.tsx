"use client"
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Repositories() {
  const [repos, setRepos] = useState<any[]>([]);
  const { getToken } = useAuth();
  const router = useRouter();
  const [healthScores, setHealthScores] = useState<{[key: string]: any}>({});
  const [showModal, setShowModal] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [repoDisplayName, setRepoDisplayName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const fetchRepos = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:8080/repos", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRepos(data);
  };

  useEffect(() => {
    fetchRepos();
  }, [getToken]);

  const fetchHealthScore = async (repoId: string) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:8080/healthscore/${repoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setHealthScores(prev => ({ ...prev, [repoId]: data }));
  };

  const parseGitHubUrl = (url: string) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  };

  const handleAddRepo = async () => {
    setAddError("");
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setAddError("Invalid GitHub URL. Use: https://github.com/owner/repo");
      return;
    }
    setAdding(true);
    try {
      const token = await getToken();
      const repoRes = await fetch("http://localhost:8080/repos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          name: repoDisplayName.trim() || parsed.repo,
          githubUrl: githubUrl.trim(),
          platform: "github"
        })
      });
      if (!repoRes.ok) throw new Error("Failed to add repository");
      const repoData = await repoRes.json();

      const ingestRes = await fetch(
        `http://localhost:8080/ingest/commits/${repoData.id}?owner=${parsed.owner}&repoName=${parsed.repo}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!ingestRes.ok) throw new Error("Failed to ingest commits");

      setShowModal(false);
      setGithubUrl("");
      setRepoDisplayName("");
      await fetchRepos();
    } catch (e: any) {
      setAddError(e.message || "Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const closeModal = () => {
    if (adding) return;
    setShowModal(false);
    setGithubUrl("");
    setRepoDisplayName("");
    setAddError("");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '240px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '32px', padding: '0 8px' }}>
          Emotional Analytics
        </div>
        <nav>
          {['Dashboard', 'Repositories', 'Reports', 'Settings'].map(item => (
            <div key={item} onClick={() => router.push(`/${item.toLowerCase()}`)} style={{
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
        <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Repositories</h1>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>All tracked repositories</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '9px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            + Add Repository
          </button>
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
                {repos.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                      No repositories yet — click <strong>+ Add Repository</strong> to get started.
                    </td>
                  </tr>
                )}
                {repos.map((repo: any, index: number) => (
                  <React.Fragment key={repo.id}>
                    <tr style={{ borderTop: '1px solid #e2e8f0', backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#0f172a' }}>{repo.name}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '500' }}>
                          {repo.platform}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{repo.githubUrl}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', color: '#64748b' }}>{new Date(repo.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px 24px', display: 'flex', gap: '8px' }}>
                        <button onClick={() => fetchHealthScore(repo.id)} style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                          View Score
                        </button>
                        <button onClick={() => router.push(`/commits?repoId=${repo.id}`)} style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                          View Commits
                        </button>
                      </td>
                    </tr>
                    {healthScores[repo.id] && (
                      <tr key={`score-${repo.id}`}>
                        <td colSpan={5} style={{ padding: '12px 24px', backgroundColor: '#f0fdf4', borderTop: '1px solid #e2e8f0' }}>
                          <span style={{ color: '#16a34a', fontWeight: '600' }}>
                            Health Score: {Math.round(healthScores[repo.id].healthScore * 10) / 10}
                          </span>
                          <span style={{ color: '#64748b', fontSize: '13px', marginLeft: '16px' }}>
                            ✓ {healthScores[repo.id].positiveCount} positive ·{' '}
                            ✗ {healthScores[repo.id].negativeCount} negative ·{' '}
                            — {healthScores[repo.id].neutralCount} neutral
                          </span>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Repository Modal */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '480px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px 0' }}>Add Repository</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
              Paste a public GitHub URL to start tracking its emotional health.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                GitHub URL <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="https://github.com/owner/repo"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                disabled={adding}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Display Name <span style={{ color: '#94a3b8', fontWeight: '400' }}>(optional — defaults to repo name)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. My Project"
                value={repoDisplayName}
                onChange={e => setRepoDisplayName(e.target.value)}
                disabled={adding}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
              />
            </div>

            {addError && (
              <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '16px', padding: '10px 12px', backgroundColor: '#fef2f2', borderRadius: '6px' }}>
                {addError}
              </p>
            )}

            {adding && (
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                Ingesting commits… this may take a moment depending on repo size.
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={closeModal}
                disabled={adding}
                style={{ padding: '9px 18px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', cursor: adding ? 'not-allowed' : 'pointer', backgroundColor: 'white', color: '#374151' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRepo}
                disabled={adding || !githubUrl.trim()}
                style={{ padding: '9px 18px', borderRadius: '6px', border: 'none', fontSize: '14px', fontWeight: '500', cursor: adding || !githubUrl.trim() ? 'not-allowed' : 'pointer', backgroundColor: adding || !githubUrl.trim() ? '#94a3b8' : '#0f172a', color: 'white' }}
              >
                {adding ? 'Adding…' : 'Add Repository'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
