// pages/admin/index.js
import { useEffect, useMemo, useState } from 'react';

const statuses = ['EN_VERIF', 'VALIDE', 'REFUSE'];

function extractPath(publicUrl) {
  // Convertit l’ancienne URL publique en chemin de storage
  // ex: https://xyz.supabase.co/storage/v1/object/public/util-docs/PROS/... -> PROS/...
  try {
    const idx = publicUrl.indexOf('/util-docs/');
    if (idx === -1) return null;
    return publicUrl.substring(idx + '/util-docs/'.length);
  } catch { return null; }
}

export default function Admin() {
  const [secret, setSecret] = useState('');
  const [status, setStatus] = useState('EN_VERIF');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Récupère le secret depuis localStorage si dispo
  useEffect(() => {
    const s = localStorage.getItem('util_admin_secret');
    if (s) setSecret(s);
  }, []);
  useEffect(() => {
    localStorage.setItem('util_admin_secret', secret || '');
  }, [secret]);

  const fetchList = async () => {
    if (!secret) { alert('Renseigne le secret ADMIN'); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${status}`, {
        headers: { Authorization: `Bearer ${secret}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur');
      setItems(json.items || []);
    } catch (e) {
      console.error(e);
      alert('Erreur de chargement');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); /* auto au chargement */ }, [status]);

  const updateStatus = async (id, next) => {
    if (!secret) return;
    const res = await fetch('/api/admin/applications/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify({ id, status: next })
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Erreur maj');
    fetchList();
  };

  const openSigned = async (maybePublicUrl) => {
    if (!secret) return;
    const path = extractPath(maybePublicUrl) || maybePublicUrl; // accepte déjà un path
    const res = await fetch(`/api/admin/sign-url?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error || 'Erreur sign-url');
    window.open(json.url, '_blank');
  };

  return (
    <div>
      <h1>Admin — Candidatures pros</h1>

      <div className="kard" style={{ padding:16, marginBottom:16 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <input
            placeholder="ADMIN_SECRET"
            className="card"
            style={{ height:40, padding:'0 10px', width:280 }}
            value={secret}
            onChange={e=>setSecret(e.target.value)}
            type="password"
          />
          <select className="card" style={{ height:40, padding:'0 10px' }} value={status} onChange={e=>setStatus(e.target.value)}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn" onClick={fetchList} disabled={loading}>{loading?'Chargement…':'Rafraîchir'}</button>
        </div>
      </div>

      {items.length === 0 && <p className="muted">Aucune candidature.</p>}

      <div className="grid" style={{ gap:16 }}>
        {items.map(app => (
          <div key={app.id} className="kard" style={{ padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div>
                <h3 style={{ margin:'0 0 4px' }}>{app.first_name} {app.last_name} — <span className="muted">{app.email}</span></h3>
                <div className="muted" style={{ fontSize:13 }}>
                  {app.phone} · {app.city} · {app.company_type}
                </div>
                <div className="muted" style={{ fontSize:13 }}>
                  Catégories : {(app.categories || []).join(', ') || '—'}
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                {app.status !== 'VALIDE' && <button className="btn btn-primary" onClick={()=>updateStatus(app.id,'VALIDE')}>Valider</button>}
                {app.status !== 'REFUSE' && <button className="btn" onClick={()=>updateStatus(app.id,'REFUSE')}>Refuser</button>}
              </div>
            </div>

            <div style={{ marginTop:12, display:'grid', gap:8 }}>
              <DocRow title="Pièce d’identité" urls={app.id_files_urls} onOpen={openSigned} />
              <DocRow title="Selfie" urls={app.selfie_urls} onOpen={openSigned} />
              <DocRow title="Assurance" urls={app.insurance_urls} onOpen={openSigned} />
              <DocRow title="Diplômes" urls={app.diplomas_urls} onOpen={openSigned} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocRow({ title, urls = [], onOpen }) {
  if (!urls || urls.length === 0) return null;
  return (
    <div>
      <strong>{title} :</strong>{' '}
      {urls.map((u, i) => (
        <button key={i} className="btn" style={{ marginRight:8 }} onClick={()=>onOpen(u)}>
          Ouvrir #{i+1}
        </button>
      ))}
    </div>
  );
}
