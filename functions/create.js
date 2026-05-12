export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("No URL", { status: 400 });
  }

  // random slug
  const slug = Math.random().toString(36).substring(2, 8);

  const data = {
    url: target,
    clicks: 0,
    createdAt: Date.now()
  };

  await env.LINKS.put(slug, JSON.stringify(data));

  return new Response(JSON.stringify({
    short: `${url.origin}/${slug}.mp4`,
    slug: slug
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
