export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const target = body.target;
    const custom = body.custom;

    if (!target || !target.startsWith("http")) {
      return Response.json({ ok: false, error: "Invalid target URL" }, { status: 400 });
    }

    let id;

    if (custom && custom.length > 0) {
      id = custom.replace(/[^a-zA-Z0-9]/g, "");
      if (!id.endsWith("1")) id += "1";
      if (!id.endsWith(".mp4")) id += ".mp4";
    } else {
      id = makeId();
    }

    const exists = await env.SHORTLINK.get(id);

    if (exists) {
      return Response.json({ ok: false, error: "ID already exists", id }, { status: 409 });
    }

    await env.SHORTLINK.put(id, target);

    return Response.json({
      ok: true,
      id,
      target,
      links: [
        "https://cdn.slicedrivee.site/" + id,
        "https://cdn2.slicedrivee.site/" + id,
        "https://media.slicedrivee.site/" + id
      ]
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

function makeId(length = 9) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  for (let i = 0; i < length - 1; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return id + "1.mp4";
}
