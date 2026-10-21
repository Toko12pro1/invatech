import { createClient } from "@supabase/supabase-js";

export default async function handler(request, response) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.authorization !== `Bearer ${cronSecret}`) {
    return response.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return response.status(500).json({ ok: false, error: "Supabase environment variables are missing" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { error } = await supabase.from("products").select("id").limit(1);

  response.setHeader("Cache-Control", "no-store");
  if (error) {
    return response.status(502).json({ ok: false, error: error.message });
  }

  return response.status(200).json({ ok: true, checkedAt: new Date().toISOString() });
}
