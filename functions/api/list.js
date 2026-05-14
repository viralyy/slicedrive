export async function onRequestGet(context) {
  const { env } = context;

  try {
    const list = await env.SHORTLINK.list();

    const links = [];

    for (const item of list.keys) {
      const target = await env.SHORTLINK.get(item.name);

      links.push({
        id: item.name,
        target,
        urls: [
          "https://cdn.slicedrivee.site/" + item.name,
          "https://cdn2.slicedrivee.site/" + item.name,
          "https://media.slicedrivee.site/" + item.name
        ]
      });
    }

    return Response.json({
      ok: true,
      count: links.length,
      links
    });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
