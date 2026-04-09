<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    created_at: string;
  }

  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const productsApiUrl = 'http://localhost:3000/api/products/100';
  async function fetchProducts() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(productsApiUrl);
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${data.message}`);
      products.value = data.products ?? data;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetchProducts);
</script>

<template>
  <div class="container">
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.stock }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
