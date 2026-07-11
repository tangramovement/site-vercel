const crypto = require('crypto');

const COOKIE_NAME = 'tangram_oauth';
const TEN_MINUTES = 600;

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function getCookie(req, name) {
  const entries = (req.headers.cookie || '').split(';');
  const match = entries.map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function allowedOrigins() {
  return (process.env.TANGRAM_ADMIN_ORIGINS || 'https://www.tangramovement.com')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);
}

function originFromReferer(req) {
  try {
    const origin = new URL(req.headers.referer).origin;
    return allowedOrigins().includes(origin) ? origin : allowedOrigins()[0];
  } catch (_error) {
    return allowedOrigins()[0];
  }
}

function sign(value) {
  return crypto.createHmac('sha256', required('TANGRAM_OAUTH_CLIENT_SECRET')).update(value).digest('hex');
}

function encodeState(state, origin) {
  const payload = Buffer.from(JSON.stringify({ state, origin })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function parseState(value) {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return allowedOrigins().includes(decoded.origin) ? decoded : null;
  } catch (_error) {
    return null;
  }
}

function setCookie(res, value, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=${maxAge}`);
}

module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const state = crypto.randomBytes(32).toString('hex');
    const origin = originFromReferer(req);
    setCookie(res, encodeState(state, origin), TEN_MINUTES);

    const authorization = new URL('https://github.com/login/oauth/authorize');
    authorization.searchParams.set('client_id', required('TANGRAM_OAUTH_CLIENT_ID'));
    authorization.searchParams.set('redirect_uri', required('TANGRAM_OAUTH_CALLBACK_URL'));
    authorization.searchParams.set('scope', 'repo read:user');
    authorization.searchParams.set('state', state);
    res.writeHead(302, { Location: authorization.toString() });
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getCookie = getCookie;
module.exports.parseState = parseState;
module.exports.setCookie = setCookie;
