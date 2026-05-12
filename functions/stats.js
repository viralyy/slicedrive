export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const slug = url.searchParams.get("slug");

  if (!slug) {
    return new Response("No slug", { status: 400 });
  }

  const raw = await env.LINKS.get(slug);

  if (!raw) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(raw, {
    headers: { "Content-Type": "application/json" }
  });
}
