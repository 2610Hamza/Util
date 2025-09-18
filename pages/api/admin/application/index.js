// pages/api/admin/applications/index.js
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  // Protection basique par secret d'admin (header)
  const secret = req.headers.authorization?.replace('Bearer ', '');
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Liste paginée (facile à étendre)
  const { status = 'EN_VERIF', limit = 50 } = req.query;

  const { data, error } = await supabaseAdmin
    .from('pro_applications')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(Number(limit));

  if (error) return res.status(400).json({ error: error.message });
  res.json({ items: data || [] });
}
