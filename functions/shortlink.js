export async function onRequestPost({ request, env }) {
  const { slug, longUrl, subdomain } = await request.json();
  if (!slug || !longUrl || !subdomain)
    return new Response("slug, longUrl, subdomain wajib", { status: 400 });

  await env.DB
    .prepare("INSERT INTO shortlinks (slug, longUrl, subdomain) VALUES (?, ?, ?)")
    .bind(slug, longUrl, subdomain)
    .run();

  return new Response(JSON.stringify({ ok: true, slug, longUrl, subdomain }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const slug = url.pathname.slice(1); // hapus '/'
  const subdomain = url.hostname.split(".")[0]; // ambil subdomain

  if (!slug) return new Response("Tidak ada slug", { status: 400 });

  const row = await env.DB
    .prepare("SELECT longUrl FROM shortlinks WHERE slug = ? AND subdomain = ?")
    .bind(slug, subdomain)
    .first();

  if (!row) return new Response("Not found", { status: 404 });

  return Response.redirect(row.longUrl, 302);
}
