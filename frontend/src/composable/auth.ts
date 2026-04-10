// composables/useAuth.ts
import { ref } from 'vue';

const accessToken = ref<string | null>(null);

export function Auth() {
  async function login(userId: string) {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    accessToken.value = data.token;
  }

  function logout() {
    accessToken.value = null;
  }

  function getToken() {
    return accessToken.value;
  }

  const isLoggedIn = () => !!accessToken.value;

  return { login, logout, getToken, isLoggedIn };
}