// api/uploads.js  (Vercel Serverless + Supabase)
// This handler uses Supabase to persist uploads.
// Expect env vars: SUPABASE_URL, SUPABASE_KEY (service_role or anon), ADMIN_SECRET (optional)

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

if(!SUPABASE_URL || !SUPABASE_KEY){
  console.warn('Supabase not configured. Create SUPABASE_URL and SUPABASE_KEY env vars.');
}

const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

module.exports = async (req, res) => {
  if(req.method === 'GET'){
    // return list of uploads, latest first
    if(!supabase) return res.status(500).json([]);
    const { data, error } = await supabase.from('uploads').select('*').order('created_at', { ascending: false }).limit(1000);
    if(error) return res.status(500).json({ error });
    return res.json(data || []);
  }

  if(req.method === 'POST'){
    // Optional admin secret check (to reduce spam). If ADMIN_SECRET is set, require header 'x-admin-secret'
    if(ADMIN_SECRET){
      const hdr = req.headers['x-admin-secret'] || '';
      if(hdr !== ADMIN_SECRET) return res.status(401).json({ error: 'unauthorized' });
    }
    const body = req.body || {};
    if(!body.name) return res.status(400).json({ error: 'name required' });

    if(!supabase) return res.status(500).json({ error: 'supabase not configured' });

    const payload = {
      name: String(body.name).slice(0,120),
      prefix: String(body.prefix || '!').slice(0,8),
      desc: String(body.desc || '').slice(0,800),
      tags: Array.isArray(body.tags) ? body.tags : (String(body.tags||'').split(',').map(s=>s.trim()).filter(Boolean)),
      avatar: body.avatar || null,
      banner: body.banner || null,
      invite: body.invite || null,
      commands: Array.isArray(body.commands) ? body.commands : (String(body.commands||'').split(',').map(s=>s.trim()).filter(Boolean)),
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('uploads').insert([payload]).select();
    if(error) return res.status(500).json({ error });
    return res.json({ ok: true, bot: data && data[0] });
  }

  res.setHeader('Allow', 'GET,POST');
  res.status(405).end('Method Not Allowed');
};


