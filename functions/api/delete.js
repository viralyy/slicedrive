export async function onRequestPost({ request, env }) {
  const { slug } = await request.json();
  await env.DB.prepare("DELETE FROM links WHERE slug = ?").bind(slug.toUpperCase()).run();
  return Response.json({ success: true });
}
