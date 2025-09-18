// pages/api/pro/apply.js
import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const d = req.body || {};

    // Normalisation minimale
    const payload = {
      email: String(d.email || '').trim(),
      first_name: d.firstName || null,
      last_name: d.lastName || null,
      phone: d.phone || null,
      city: d.city || null,
      categories: Array.isArray(d.categories) ? d.categories : [],
      id_type: d.idType || null,
      id_files_urls: Array.isArray(d.idFilesUrls) ? d.idFilesUrls : [],
      selfie_urls: Array.isArray(d.selfieUrls) ? d.selfieUrls : [],
      company_type: d.companyType || null,
      siren: d.siren || null,
      siret: d.siret || null,
      insurance_urls: Array.isArray(d.insuranceUrls) ? d.insuranceUrls : [],
      diplomas_urls: Array.isArray(d.diplomasUrls) ? d.diplomasUrls : [],
      status: 'EN_VERIF',
    };

    if (!payload.email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    const { data, error } = await supabase
      .from('pro_applications')
      .insert([payload])
      .select('id')
      .single();

    if (error) {
      console.error('[apply] insert error', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('[apply] unexpected', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
