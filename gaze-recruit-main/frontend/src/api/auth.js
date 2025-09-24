import { apiGet, apiPost } from './client.js';

export async function signUp({ email, password, fullName, phone }) {
  const res = await apiPost('/api/auth/signup', { email, password, fullName, phone });
  return res; // { token }
}

export async function signIn({ email, password }) {
  const res = await apiPost('/api/auth/signin', { email, password });
  return res; // { token }
}

export async function getSession() {
  // Returns { user: { id, email } | null }
  return apiGet('/api/auth/session');
}
