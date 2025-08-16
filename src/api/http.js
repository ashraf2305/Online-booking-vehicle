// Lightweight HTTP client using fetch with optional JWT support
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080';

function buildHeaders(token, extraHeaders) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(extraHeaders || {})
  });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export async function request(method, path, { body, token, headers } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const requestHeaders = buildHeaders(token, headers);
  
  console.log(`Making ${method} request to:`, url);
  console.log('Headers:', Object.fromEntries(requestHeaders.entries()));
  if (body) console.log('Body:', body);
  
  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : await response.text();
  
  console.log('Response data (raw):', data);
  console.log('Response data type:', typeof data);
  if (data && typeof data === 'object') {
    console.log('Response data keys:', Object.keys(data));
  }

  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText || 'Request failed';
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    console.error('Request failed:', err);
    throw err;
  }

  return data;
}

export const http = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, opts) => request('POST', path, opts),
  put: (path, opts) => request('PUT', path, opts),
  del: (path, opts) => request('DELETE', path, opts),
};

export { API_BASE_URL };


