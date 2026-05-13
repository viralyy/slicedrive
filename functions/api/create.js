export async function onRequestPost({ request, env }) {
  const { slug, destination } = await request.json();

  if (!slug || slug.length !== 8 || !/\d$/.test(slug)) {
    return Response.json({ error: "Slug harus 8 karakter berakhiran angka" }, { status: 400 });
  }

  try {
    await env.DB.prepare("INSERT INTO links (slug, destination, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)")
      .bind(slug.toUpperCase(), destination)
      .run();
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Slug sudah ada" }, { status: 400 });
  }
}
