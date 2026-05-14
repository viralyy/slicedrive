const ALLOWED_DOMAINS = [
  "cdn.slicedrivee.site",
  "cdn2.slicedrivee.site",
  "media.slicedrivee.site"
];

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") return new Response(null,{status:204,headers});

  try {
    const body = await request.json();
    const target = body.target;
    const custom = body.custom;
    const domain = body.domain;

    if (!target || !target.startsWith("http")) {
      return new Response(JSON.stringify({ ok:false, error:"Invalid target URL" }), { status:400, headers });
    }

    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      return new Response(JSON.stringify({ ok:false, error:"Invalid domain" }), { status:400, headers });
    }

    let id;
    if (custom && custom.length>0){
      id = custom.replace(/[^a-zA-Z0-9]/g,'');
      if(!id.endsWith('1')) id+='1';
      if(!id.endsWith('.mp4')) id+='.mp4';
    }else{
      id = makeId();
    }

    const key = domain+":"+id;
    const exists = await env.SHORTLINK.get(key);

    if(exists){
      return new Response(JSON.stringify({ ok:false, error:"ID already exists", id }), { status:409, headers });
    }

    const data = { id, domain, target, createdAt:new Date().toISOString(), clicks:0 };
    await env.SHORTLINK.put(key, JSON.stringify(data));

    return new Response(JSON.stringify({ ok:true, id, domain, target, link:`https://${domain}/${id}` }), { status:200, headers });
  } catch(e){
    return new Response(JSON.stringify({ ok:false, error:e.message }), { status:500, headers });
  }
}

function makeId(length=9){
  const chars="abcdefghijklmnopqrstuvwxyz0123456789";
  let id="";
  for(let i=0;i<length-1;i++) id+=chars[Math.floor(Math.random()*chars.length)];
  return id+'1.mp4';
}
