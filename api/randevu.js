export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const { ad, soyad, telefon, email, tedavi, tarih, mesaj } = req.body;

  if (!ad || !soyad || !telefon || !email || !tedavi) {
    return res.status(400).json({ ok: false, error: "Eksik alan var." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Randevu Formu <randevu@drmazhareserdag.com>",
        to: process.env.TO_EMAIL,
        subject: "Yeni Randevu Talebi",
        reply_to: email,
        html: `
          <h2>Yeni Randevu</h2>
          <p><b>Ad:</b> ${ad}</p>
          <p><b>Soyad:</b> ${soyad}</p>
          <p><b>Telefon:</b> ${telefon}</p>
          <p><b>Eposta:</b> ${email}</p>
          <p><b>Tedavi:</b> ${tedavi}</p>
          <p><b>Tarih:</b> ${tarih || "-"}</p>
          <p><b>Mesaj:</b><br/>${mesaj || "-"}</p>
        `,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ ok: false });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false });
  }
}