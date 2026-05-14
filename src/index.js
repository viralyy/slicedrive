export default {
    async fetch(request, env) {
        const { method } = request;

        if (method === "GET") {
            return handleGet(request, env);
        }
        if (method === "POST") {
            return handlePost(request, env);
        }

        return new Response("Method not allowed", { status: 405 });
    }
};

// ====================== GET (Redirect) ======================
async function handleGet(request, env) {
    try {
        const url = new URL(request.url);
        let slug = url.pathname.replace("/", "").trim();

        if (!slug) {
            return new Response("Slug tidak diberikan", { status: 400 });
        }

        const target = await env.DB.get(slug);

        if (!target) {
            return new Response("Shortlink tidak ditemukan", { 
                status: 404,
                headers: { "Content-Type": "text/plain; charset=utf-8" }
            });
        }

        return Response.redirect(target, 302);
    } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}

// ====================== POST (Create Shortlink) ======================
async function handlePost(request, env) {
    try {
        const data = await request.json();
        const { slug, longUrl } = data;

        if (!slug || !longUrl) {
            return new Response("slug dan longUrl wajib diisi", { status: 400 });
        }

        // Optional: validasi slug (hanya alphanumeric + - _)
        if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
            return new Response("Slug hanya boleh huruf, angka, - dan _", { status: 400 });
        }

        await env.DB.put(slug, longUrl, {
            expirationTtl: 60 * 60 * 24 * 365 // 1 tahun (opsional)
        });

        return Response.json({
            ok: true,
            shortUrl: `https://\( {request.headers.get("host")}/ \){slug}`
        });

    } catch (err) {
        return new Response(`Error: ${err.message}`, { status: 500 });
    }
}
