import { useMemo, useState } from 'react';
import Stepper from '../components/Stepper';
import UploadBox from '../components/UploadBox';

const safeId = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const STEPS = ['Compte', 'Identité', 'Entreprise', 'Récap'];

const allCategories = [
  'plomberie',
  'electricite',
  'informatique',
  'coiffure',
  'menage',
  'coaching',
  'sante',
  'jardinage',
];

const initial = {
  email: '',
  password: '',
  phone: '',
  firstName: '',
  lastName: '',
  city: '',
  categories: [],
  idType: 'cni',
  idFilesUrls: [],
  selfieUrls: [],
  companyType: 'auto-entrepreneur',
  siren: '',
  siret: '',
  insuranceUrls: [],
  diplomasUrls: [],
  terms: false,
};

export default function SignupPro() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const proFolder = useMemo(() => {
    const slug = safeId(data.email || 'prospect');
    return `pros/${slug}`;
  }, [data.email]);

  const canNext = useMemo(() => validate(step, data), [step, data]);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/pro/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur');

      alert('Candidature envoyée ✔️ Nous validerons vos documents sous peu.');
      window.location.href = '/';
    } catch (e) {
      console.error(e);
      alert('Échec de l’envoi. Réessaie ou contacte le support.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Inscription Professionnel</h1>
      <Stepper steps={STEPS} current={step} />

      {step === 0 && <StepAccount data={data} setData={setData} />}
      {step === 1 && (
        <StepIdentity data={data} setData={setData} proFolder={proFolder} />
      )}
      {step === 2 && (
        <StepCompany data={data} setData={setData} proFolder={proFolder} />
      )}
      {step === 3 && <StepReview data={data} />}

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {step > 0 && (
          <button className="btn" onClick={prev}>
            Retour
          </button>
        )}
        {step < STEPS.length - 1 && (
          <button className="btn btn-primary" disabled={!canNext} onClick={next}>
            Continuer
          </button>
        )}
        {step === STEPS.length - 1 && (
          <button
            className="btn btn-primary"
            disabled={!data.terms || submitting}
            onClick={submit}
          >
            {submitting ? 'Envoi…' : 'Envoyer ma candidature'}
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------- Sous-composants -------------------- */

function Field({ label, children, help }) {
  return (
    <label style={{ display: 'block', margin: '12px 0' }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {children}
      {help && (
        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
          {help}
        </div>
      )}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="card"
      style={{ width: '100%', height: 40, padding: '0 10px' }}
    />
  );
}
function Select(props) {
  return (
    <select
      {...props}
      className="card"
      style={{ width: '100%', height: 40, padding: '0 10px' }}
    />
  );
}
function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

/* Étape 1 */
function StepAccount({ data, setData }) {
  return (
    <div className="kard" style={{ padding: 16 }}>
      <Field label="Adresse e‑mail">
        <Input
          type="email"
          value={data.email}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
        />
      </Field>
      <Field label="Mot de passe" help="8 caractères min.">
        <Input
          type="password"
          value={data.password}
          onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Prénom">
          <Input
            value={data.firstName}
            onChange={(e) =>
              setData((d) => ({ ...d, firstName: e.target.value }))
            }
          />
        </Field>
        <Field label="Nom">
          <Input
            value={data.lastName}
            onChange={(e) =>
              setData((d) => ({ ...d, lastName: e.target.value }))
            }
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Téléphone">
          <Input
            value={data.phone}
            onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
          />
        </Field>
        <Field label="Ville">
          <Input
            value={data.city}
            onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
          />
        </Field>
      </div>

      <Field label="Catégories proposées">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {allCategories.map((c) => (
            <Checkbox
              key={c}
              checked={data.categories.includes(c)}
              onChange={(v) =>
                setData((d) => {
                  const set = new Set(d.categories);
                  v ? set.add(c) : set.delete(c);
                  return { ...d, categories: [...set] };
                })
              }
              label={c}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}

/* Étape 2 */
function StepIdentity({ data, setData, proFolder }) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="kard" style={{ padding: 16 }}>
        <Field label="Type de pièce d’identité">
          <Select
            value={data.idType}
            onChange={(e) => setData((d) => ({ ...d, idType: e.target.value }))}
          >
            <option value="cni">Carte nationale d’identité</option>
            <option value="passport">Passeport</option>
            <option value="titre">Titre de séjour</option>
          </Select>
        </Field>

        <UploadBox
          label="Pièce d’identité (recto/verso ou passeport)"
          bucket="util-docs"
          folder={`${proFolder}/identity`}
          onUploaded={(urls) =>
            setData((d) => ({ ...d, idFilesUrls: urls || [] }))
          }
        />

        <UploadBox
          label="Selfie / Liveness"
          bucket="util-docs"
          folder={`${proFolder}/selfie`}
          onUploaded={(urls) =>
            setData((d) => ({ ...d, selfieUrls: urls || [] }))
          }
        />
      </div>

      <div className="muted" style={{ fontSize: 12 }}>
        Astuce : pour validation accélérée, photos nettes et bien cadrées.
      </div>
    </div>
  );
}

/* Étape 3 */
function StepCompany({ data, setData, proFolder }) {
  return (
    <div className="kard" style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Statut">
          <Select
            value={data.companyType}
            onChange={(e) =>
              setData((d) => ({ ...d, companyType: e.target.value }))
            }
          >
            <option value="auto-entrepreneur">Auto-entrepreneur</option>
            <option value="sasu">SASU / SAS</option>
            <option value="eurl">EURL / SARL</option>
            <option value="autre">Autre</option>
          </Select>
        </Field>
        <Field label="Ville d’intervention">
          <Input
            value={data.city}
            onChange={(e) => setData((d) => ({ ...d, city: e.target.value }))}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="SIREN">
          <Input
            value={data.siren}
            onChange={(e) => setData((d) => ({ ...d, siren: e.target.value }))}
          />
        </Field>
        <Field label="SIRET">
          <Input
            value={data.siret}
            onChange={(e) => setData((d) => ({ ...d, siret: e.target.value }))}
          />
        </Field>
      </div>

      <UploadBox
        label="Attestation d’assurance pro (RC Pro)"
        accept="application/pdf,image/*"
        bucket="util-docs"
        folder={`${proFolder}/insurance`}
        onUploaded={(urls) =>
          setData((d) => ({ ...d, insuranceUrls: urls || [] }))
        }
      />

      <UploadBox
        label="Diplômes / Certificats"
        accept="application/pdf,image/*"
        bucket="util-docs"
        folder={`${proFolder}/diplomas`}
        onUploaded={(urls) =>
          setData((d) => ({ ...d, diplomasUrls: urls || [] }))
        }
      />
    </div>
  );
}

/* Étape 4 */
function StepReview({ data }) {
  return (
    <div className="kard" style={{ padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Récapitulatif</h3>
      <ul>
        <li>
          <b>Nom</b> : {data.firstName} {data.lastName}
        </li>
        <li>
          <b>Email</b> : {data.email}
        </li>
        <li>
          <b>Téléphone</b> : {data.phone}
        </li>
        <li>
          <b>Ville</b> : {data.city}
        </li>
        <li>
          <b>Catégories</b> : {data.categories.join(', ') || '—'}
        </li>
        <li>
          <b>Pièce d’identité</b> : {data.idType} ({(data.idFilesUrls || []).length}{' '}
          fichier·s)
        </li>
        <li>
          <b>Selfie</b> : {(data.selfieUrls || []).length} fichier·s
        </li>
        <li>
          <b>SIREN/SIRET</b> : {data.siren || '—'} / {data.siret || '—'}
        </li>
        <li>
          <b>Assurance</b> : {(data.insuranceUrls || []).length} fichier·s
        </li>
        <li>
          <b>Diplômes</b> : {(data.diplomasUrls || []).length} fichier·s
        </li>
      </ul>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <input
          type="checkbox"
          checked={data.terms}
          onChange={(e) => (data.terms = e.target.checked)}
        />
        <span>Je certifie l’exactitude de mes informations et j’accepte les CGU.</span>
      </label>
    </div>
  );
}

/* Validation */
function validate(step, d) {
  if (step === 0) {
    return (
      d.email &&
      d.password?.length >= 8 &&
      d.firstName &&
      d.lastName &&
      d.phone &&
      d.city &&
      d.categories.length > 0
    );
  }
  if (step === 1) {
    return (d.idFilesUrls?.length || 0) > 0 && (d.selfieUrls?.length || 0) > 0;
  }
  if (step === 2) {
    return !!(d.siren || d.siret);
  }
  return true;
}
