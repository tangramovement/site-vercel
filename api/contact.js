function value(input, maxLength = 500) {
  return typeof input === 'string' ? input.trim().slice(0, maxLength) : '';
}

function escapeHtml(input) {
  return input.replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  if (value(data['bot-field'])) return res.status(200).json({ ok: true });

  const name = value(data.Name, 120);
  const email = value(data.Email, 254);
  const phone = value(data.Phone, 80);
  const location = value(data.Location, 160);
  const region = value(data.Region, 80);
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Name and a valid email are required.' });

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT;
  const sender = process.env.CONTACT_SENDER;
  if (!apiKey || !recipient || !sender) return res.status(503).json({ error: 'Contact form is not configured yet.' });

  const html = `<h2>New Tangram contact</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Location:</strong> ${escapeHtml(location)}</p><p><strong>Region:</strong> ${escapeHtml(region)}</p>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: sender, to: [recipient], reply_to: email, subject: `Tangram contact: ${name}`, html }),
  });

  if (!response.ok) return res.status(502).json({ error: 'Could not deliver the message.' });
  return res.status(200).json({ ok: true });
};
