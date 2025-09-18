import { useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * UploadBox (upload réel Supabase Storage)
 * - label: titre du bloc
 * - accept: MIME acceptés
 * - bucket: nom du bucket (ex: "util-docs")
 * - folder: chemin/dossier cible (ex: "pros/pro-hamza/identity")
 * - onUploaded(urls): callback avec les URLs publiques
 */
export default function UploadBox({ label, accept='image/*,application/pdf', bucket='util-docs', folder='misc', onUploaded }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState([]);

  const startUpload = async (list) => {
    const arr = Array.from(list || []);
    setFiles(arr);
    if (!arr.length) return;

    setUploading(true);
    try {
      const out = [];
      for (const file of arr) {
        const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
        const path = `${folder}/${uid()}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw error;

        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        out.push(data.publicUrl);
      }
      setUrls(out);
      onUploaded?.(out);
    } catch (e) {
      console.error(e);
      alert('Échec upload. Vérifie la config Supabase/permissions.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="kard" style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <strong>{label}</strong>
        <button className="btn" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Envoi…' : 'Parcourir…'}
        </button>
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); startUpload(e.dataTransfer.files); }}
        style={{ border:'1px dashed var(--border)', borderRadius:12, padding:16, textAlign:'center', background:'#fafafa' }}
      >
        {uploading ? 'Téléversement en cours…' : 'Glissez / déposez vos fichiers ici'}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        style={{ display:'none' }}
        onChange={e => startUpload(e.target.files)}
      />

      {files.length > 0 && (
        <ul style={{ margin:'12px 0 0', paddingLeft:18 }}>
          {files.map((f,i) => <li key={i} className="muted">{f.name}</li>)}
        </ul>
      )}

      {urls.length > 0 && (
        <div style={{ marginTop:8 }}>
          <div className="muted" style={{ fontSize:12, marginBottom:6 }}>Fichiers envoyés :</div>
          <ul style={{ margin:0, paddingLeft:18 }}>
            {urls.map((u,i) => <li key={i}><a href={u} target="_blank" rel="noreferrer">{u}</a></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
