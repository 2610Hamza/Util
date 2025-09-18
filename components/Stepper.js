export default function Stepper({ steps, current }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${steps.length},1fr)`, gap:12, margin:'16px 0 24px' }}>
      {steps.map((label, i) => {
        const active = i <= current;
        return (
          <div key={label} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'8px 12px', border:'1px solid var(--border)',
            borderRadius:12, background: active ? '#111' : '#fff',
            color: active ? '#fff' : '#111', fontWeight:600
          }}>
            <span style={{
              width:22, height:22, borderRadius:999, display:'inline-flex',
              alignItems:'center', justifyContent:'center',
              background: active ? '#fff' : '#111', color: active ? '#111' : '#fff', fontSize:12
            }}>{i+1}</span>
            <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
