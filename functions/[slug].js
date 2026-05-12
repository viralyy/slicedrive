export async function onRequest(context) {
  const { params, env } = context;

  let slug = params.slug;

  // hapus extension
  slug = slug.replace(".mp4", "");

  const raw = await env.LINKS.get(slug);

  if (!raw) {
    return new Response("Not found", { status: 404 });
  }

  const data = JSON.parse(raw);

  // tracking klik
  data.clicks += 1;
  data.lastClick = Date.now();

  await env.LINKS.put(slug, JSON.stringify(data));

  return Response.redirect(data.url, 302);
}
