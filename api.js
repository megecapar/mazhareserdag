export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  try {
    const { ad, soyad, telefon, email, tedavi, tarih, mesaj } = req.body || {};

    if (!ad || !soyad || !telefon || !email || !tedavi) {
      return res.status(400).json({ ok: false, error: "Eksik alan var." });
    }

    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Randevu Formu <onboarding@resend.dev>",
        to: process.env.TO_EMAIL,
        subject: "Yeni Randevu Talebi",
        reply_to: email,
        html: `
          <h2>Yeni Randevu Talebi</h2>
          <p><b>Ad:</b> ${escapeHtml(ad)}</p>
          <p><b>Soyad:</b> ${escapeHtml(soyad)}</p>
          <p><b>Telefon:</b> ${escapeHtml(telefon)}</p>
          <p><b>E-posta:</b> ${escapeHtml(email)}</p>
          <p><b>Tedavi:</b> ${escapeHtml(tedavi)}</p>
          <p><b>Tarih:</b> ${escapeHtml(tarih || "-")}</p>
          <p><b>Mesaj:</b><br/>${escapeHtml(mesaj || "-").replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return res.status(500).json({ ok: false, error: t });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}