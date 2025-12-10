const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'Method not allowed' });
  }

  try {
    const { q } = req.body || {};
    if (!q || typeof q !== 'string') {
      res.statusCode = 400;
      return res.json({ error: 'Field "q" wajib string.' });
    }

    // PANGGIL API WEBPILOT DI SINI
    const r = await axios.post(
      'https://api.webpilotai.com/rupee/v1/search',
      { q, threadId: '' },
      {
        responseType: 'json',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          origin: 'https://www.webpilot.ai'
          // kalau nanti punya API key resmi:
          // authorization: `Bearer ${process.env.WEBPILOT_API_KEY}`
        }
      }
    );

    // SESUAIKAN DENGAN STRUKTUR RESPONSE SEBENARNYA DARI API
    const data = r.data || {};
    const text =
      data.answer ||
      data.text ||
      'Tidak ada jawaban yang bisa diambil dari API.';

    res.statusCode = 200;
    return res.json({
      text,
      raw: data
    });
  } catch (e) {
    console.error('API error:', e.message);
    res.statusCode = 500;
    return res.json({
      error: 'API error',
      detail: e.message || 'Unknown error'
    });
  }
};
