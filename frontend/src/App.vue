<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Auth } from './composable/auth';
  interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    created_at: string;
  }

  type CreateProductPayload = Omit<Product, 'id' | 'created_at'>;
  const { login, getToken, isLoggedIn } = Auth();
  const loginError = ref<string | null>(null);
  const userId = ref('');

  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const productsApiUrl = 'http://localhost:3000/api/products';

  const product = ref<CreateProductPayload>({ name: '', price: 0, stock: 0, category: '' });
  const formError = ref<string | null>(null);
  const formSubmitting = ref(false);

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    };
  }

  async function handleLogin() {
    try {
      await login(userId.value);
      fetchProducts();
    } catch (e) {
      loginError.value = e instanceof Error ? e.message : String(e);
    }
  }
  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(productsApiUrl, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${data.message}`);
      products.value = data.products;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    error.value = null;
    try {
      const res = await fetch(`${productsApiUrl}/${id}`, { 
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(`HTTP ${res.status}: ${data.message}`);
      }
      products.value = products.value.filter(p => p.id !== id);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    }
  }

  async function createProduct() {
    formError.value = null;
    formSubmitting.value = true;
    try {
      const res = await fetch(productsApiUrl, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(product.value),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${data.message ?? JSON.stringify(data.errors)}`);
      products.value.push(data.product);
      product.value = { name: '', price: 0, stock: 0, category: '' };
    } catch (e) {
      formError.value = e instanceof Error ? e.message : String(e);
    } finally {
      formSubmitting.value = false;
    }
  }
</script>

<template>
  <!-- Login form -->
  <div v-if="!isLoggedIn()">
    <h1>Login</h1>
    <p v-if="loginError" class="error">{{ loginError }}</p>
    <form @submit.prevent="handleLogin">
      <input v-model="userId" type="text" placeholder="User ID" required />
      <button type="submit">Login</button>
    </form>
  </div>

  <div v-else class="container">
    <h1>Products</h1>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>

    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
          <td><button @click="deleteProduct(product.id)">Delete</button></td>
        </tr>
      </tbody>
    </table>

    <form @submit.prevent="createProduct">
      <h2>Add Product</h2>
      <p v-if="formError" class="error">{{ formError }}</p>
      <div>
        <label>Name<input v-model="product.name" type="text" required /></label>
      </div>
      <div>
        <label>Category<input v-model="product.category" type="text" required /></label>
      </div>
      <div>
        <label>Price<input v-model.number="product.price" type="number" step="0.01" min="0.01" required /></label>
      </div>
      <div>
        <label>Stock<input v-model.number="product.stock" type="number" step="1" min="0" required /></label>
      </div>
      <button type="submit" :disabled="formSubmitting">
        {{ formSubmitting ? 'Adding...' : 'Add Product' }}
      </button>
    </form>
  </div>
</template>
