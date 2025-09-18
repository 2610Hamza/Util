// pages/api/admin/sign-url.js
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  const secret = req.headers.authorization?.replace('Bearer ', '');
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });

  const { path, expiresIn = 1800, bucket = 'util-docs' } = req.query; // 30 min par défaut
  if (!path) return res.status(400).json({ error: 'Missing path' });

  const { data, error } = await supabaseAdmin
    .storage
    .from(bucket)
    .createSignedUrl(path, Number(expiresIn));

  if (error) return res.status(400).json({ error: error.message });
  res.json({ url: data.signedUrl });
}
