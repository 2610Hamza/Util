import { useRef, useState } from 'react';

export default function UploadBox({ label, accept='image/*,application/pdf', onFiles }) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handle = (list) => {
    const arr = Array.from(list);
    setFiles(arr);
    onFiles?.(arr);
  };

  return (
    <div className="kard" style={{ padding:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
        <strong>{label}</strong>
        <button className="btn" onClick={() => inputRef.current?.click()}>Parcourir…</button>
      </div>
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files); }}
        style={{ border:'1px dashed var(--border)', borderRadius:12, padding:16, textAlign:'center', background:'#fafafa' }}
      >
        Glissez / déposez vos fichiers ici
      </div>
      <input ref={inputRef} type="file" accept={accept} multiple style={{ display:'none' }}
             onChange={e => handle(e.target.files)} />
      {files.length > 0 && (
        <ul style={{ margin:'12px 0 0', paddingLeft:18 }}>
          {files.map((f,i) => <li key={i} className="muted">{f.name}</li>)}
        </ul>
      )}
    </div>
  );
}
