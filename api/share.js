import { createClient } from "@supabase/supabase-js";

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function absoluteUrl(baseUrl, value) {
  if (!value) return `${baseUrl}/images/hero-shop.jpg`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${String(value).startsWith("/") ? "" : "/"}${value}`;
}

function getBaseUrl(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = request.headers.host || "innotech-chi.vercel.app";
  return `${forwardedProto}://${host}`;
}

function queryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function renderPreview({ baseUrl, title, description, image, shareUrl, targetUrl, type = "website" }) {
  const safeTarget = JSON.stringify(targetUrl).replace(/</g, "\\u003c");
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeShareUrl = escapeHtml(shareUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeShareUrl}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="Innovatech Engineering Solutions" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:url" content="${safeShareUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
  </head>
  <body>
    <p>Opening Innovatech… <a href="${escapeHtml(targetUrl)}">Open this page</a></p>
    <script>window.location.replace(${safeTarget});</script>
  </body>
</html>`;
}

export default async function handler(request, response) {
  const baseUrl = getBaseUrl(request);
  const type = queryValue(request.query?.type);
  const id = queryValue(request.query?.id);
  const referral = queryValue(request.query?.ref);
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey || !id || !["product", "store"].includes(type)) {
    return response.status(400).send("Invalid share link.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  let title;
  let description;
  let image;
  let targetPath;

  if (type === "product") {
    const { data, error } = await supabase
      .from("products")
      .select("id, name_en, price, condition, image_url, store_id, stores(name, location)")
      .eq("id", id)
      .eq("active", true)
      .maybeSingle();
    if (error || !data) return response.status(404).send("Product not found.");

    const relatedStore = Array.isArray(data.stores) ? data.stores[0] : data.stores;
    const storeName = relatedStore?.name || "Innovatech Verified Hub";
    title = `${data.name_en} | Innovatech Marketplace`;
    description = `${data.condition} ${data.name_en} at ${new Intl.NumberFormat("en-US").format(data.price)} FCFA through ${storeName}. Ask Innovatech to confirm availability.`;
    image = absoluteUrl(baseUrl, data.image_url);
    targetPath = `/product/${encodeURIComponent(id)}`;
  } else {
    const { data, error } = await supabase
      .from("stores")
      .select("id, name, category, location, description, image_url")
      .eq("id", id)
      .eq("active", true)
      .eq("verified", true)
      .maybeSingle();
    if (error || !data) return response.status(404).send("Store not found.");

    title = `${data.name} | Innovatech Stores`;
    description = `${data.category} in ${data.location}. See verified listings and contact ${data.name} through Innovatech.`;
    image = absoluteUrl(baseUrl, data.image_url);
    targetPath = `/store/${encodeURIComponent(id)}`;
  }

  const query = referral ? `?ref=${encodeURIComponent(String(referral))}` : "";
  const targetUrl = `${baseUrl}${targetPath}${query}`;
  const shareUrl = `${baseUrl}/share/${type}/${encodeURIComponent(id)}${query}`;
  response.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  return response.status(200).send(renderPreview({ baseUrl, title, description, image, shareUrl, targetUrl, type: type === "product" ? "product" : "business.business" }));
}
