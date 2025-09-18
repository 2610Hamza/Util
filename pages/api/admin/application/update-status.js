// pages/api/admin/applications/update-status.js
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = req.headers.authorization?.replace('Bearer ', '');
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { id, status } = req.body || {};
  if (!id || !['EN_VERIF', 'VALIDE', 'REFUSE'].includes(status)) {
    return res.status(400).json({ error: 'Bad payload' });
  }

  const { error } = await supabaseAdmin
    .from('pro_applications')
    .update({ status })
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
}
