const crypto = require('crypto');
const { getCookie, parseState, setCookie } = require('./auth');

const COOKIE_NAME = 'tangram_oauth';

function escapeForScript(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function sendPopupResult(res, origin, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Authorizing Tangram Admin</title></head><body><p>Authorizing Tangram Admin...</p><script>
    const targetOrigin = ${escapeForScript(origin)};
    const result = ${escapeForScript(message)};
    function finish() {
      if (window.opener) window.opener.postMessage(result, targetOrigin);
      window.close();
    }
    window.addEventListener('message', finish, { once: true });
    if (window.opener) window.opener.postMessage('authorizing:github', targetOrigin);
  </script></body></html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const stored = parseState(getCookie(req, COOKIE_NAME));
  setCookie(res, '', 0);
  const state = typeof req.query.state === 'string' ? req.query.state : '';
  if (!stored || !state || stored.state.length !== state.length || !crypto.timingSafeEqual(Buffer.from(stored.state), Buffer.from(state))) {
    return res.status(400).send('Invalid OAuth state. Please close this window and try again.');
  }

  if (req.query.error) return sendPopupResult(res, stored.origin, 'error', { error: String(req.query.error) });
  if (typeof req.query.code !== 'string') return res.status(400).send('Missing GitHub authorization code.');

  try {
    const body = new URLSearchParams({
      client_id: process.env.TANGRAM_OAUTH_CLIENT_ID || '',
      client_secret: process.env.TANGRAM_OAUTH_CLIENT_SECRET || '',
      code: req.query.code,
      redirect_uri: process.env.TANGRAM_OAUTH_CALLBACK_URL || '',
    });
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = await response.json();
    if (!response.ok || !data.access_token) throw new Error(data.error_description || 'GitHub token exchange failed');
    return sendPopupResult(res, stored.origin, 'success', { token: data.access_token });
  } catch (error) {
    return sendPopupResult(res, stored.origin, 'error', { error: error.message });
  }
};
