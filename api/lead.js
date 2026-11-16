const FIELDS = ["nome", "email", "telefone", "segmento", "colaboradores", "dificuldade", "erpAtual"];
const MAX_LEN = 500;

function clean(value) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_LEN);
}

export async function POST(request) {
  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (!webhook) {
    console.error("LEADS_WEBHOOK_URL ausente");
    return Response.json(
      { ok: false, error: "Envio indisponível no momento." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("JSON inválido no lead", error);
    return Response.json({ ok: false, error: "Dados inválidos." }, { status: 400 });
  }

  const payload = { sentAt: new Date().toISOString() };
  for (const field of FIELDS) payload[field] = clean(body?.[field]);

  if (!payload.nome || !payload.email || !payload.telefone) {
    return Response.json(
      { ok: false, error: "Nome, e-mail e telefone são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) {
      console.error("Webhook recusou o lead", upstream.status);
      return Response.json(
        { ok: false, error: "Não foi possível registrar agora." },
        { status: 502 }
      );
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Falha ao encaminhar lead", error);
    return Response.json(
      { ok: false, error: "Não foi possível registrar agora." },
      { status: 502 }
    );
  }
}
