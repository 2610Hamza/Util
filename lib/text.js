// lib/text.js
const STOP = new Set([
  'le','la','les','de','des','du','un','une','et','ou','pour','avec','a','à','au','aux','en','sur','dans','par','chez',
  'mon','ton','son','nos','vos','leurs','je','tu','il','elle','on','nous','vous','ils','elles','est','suis','faire','fait',
]);

const SYN = {
  plomberie: ['plombier','fuite','canalisation','robinet','wc','salle de bain'],
  electricite: ['electricien','électricien','lumiere','lumière','prise','compteur','tableau','panne'],
  menage: ['menage','ménage','nettoyage','femme de menage','proprete','propreté'],
  informatique: ['pc','ordinateur','mac','panne','wifi','internet','reseau','réseau','depannage','dépannage'],
  coiffure: ['coiffeur','coiffure','coupe','brushing','coloration','barbier'],
  coaching: ['coach','accompagnement','mentorat','conseil','formation'],
  sante: ['medecin','médecin','docteur','consultation','infirmier','sante','santé','psychologue'],
  jardinage: ['jardinier','jardinage','tonte','pelouse','taille','arrosage'],
};

export function normalize(str='') {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(str='') {
  const base = normalize(str).split(' ').filter(Boolean);
  const out = [];
  for (const tok of base) {
    if (STOP.has(tok)) continue;
    out.push(tok);
    for (const [k, arr] of Object.entries(SYN)) {
      if (tok === k || arr.includes(tok)) out.push(k, ...arr);
    }
  }
  return out;
}

export function tfVector(tokens=[]) {
  const m = new Map();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  const norm = Math.sqrt([...m.values()].reduce((s,v)=>s+v*v,0)) || 1;
  const obj = {};
  for (const [k,v] of m) obj[k] = v / norm;
  return obj;
}

export function cosine(a={}, b={}) {
  let s = 0;
  for (const k in a) if (Object.prototype.hasOwnProperty.call(b,k)) s += a[k] * b[k];
  return s;
}

export function textSimilarity(aStr='', bStr='') {
  const va = tfVector(tokenize(aStr));
  const vb = tfVector(tokenize(bStr));
  return cosine(va, vb);
}
