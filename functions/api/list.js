export async function onRequest({ env }) {
  const { results } = await env.DB.prepare("SELECT slug, destination FROM links ORDER BY created_at DESC").all();
  return Response.json(results);
}
