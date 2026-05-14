export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return Response.json({ ok: false, error: "ID required" }, { status: 400 });
    }

    await env.SHORTLINK.delete(id);

    return Response.json({
      ok: true,
      deleted: id
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
