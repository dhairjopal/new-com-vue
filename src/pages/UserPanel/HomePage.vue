<template>
  <q-page padding class="bg-grey-2">
    <div class="text-h4 q-mb-lg text-weight-bold text-center text-primary">
      Our Shop
    </div>

    <div class="row q-col-gutter-md">
      <div
        v-for="product in products"
        :key="product.id"
        class="col-12 col-sm-6 col-md-3"
      >
        <q-card flat bordered class="product-card column full-height">
          <q-img :src="product.imagePath" :ratio="1" class="rounded-borders">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                No Image Found
              </div>
            </template>
          </q-img>

          <q-card-section class="col">
            <div class="text-subtitle1 text-weight-bold">
              {{ product.name }}
            </div>
            <div class="text-primary text-h6 text-weight-bolder">
              ${{ product.price.toLocaleString() }}
            </div>
          </q-card-section>

          <q-card-actions vertical class="q-pa-md">
            <q-btn
              color="primary"
              icon="shopping_cart"
              label="Add to Cart"
              unelevated
              class="full-width text-weight-bold"
              @click="addToCart(product)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>

import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "HomePage",
  setup() {
    const $q = useQuasar();

    // Updated with relative paths which are more robust in Quasar/Webpack
    const products = ref([
      { id: 1, name: "Wireless Headphones", price: 550, imagePath: require("../../assets/banner/phone/banner2.jpeg") },
      { id: 2, name: "Smart Watch", price: 330, imagePath: require("../../assets/banner/phone/banner3.jpeg") },
      { id: 3, name: "Gaming Mouse", price: 2240, imagePath: require("../../assets/banner/phone/banner8.jpeg") },
      { id: 4, name: "Mechanical Keyboard", price: 990, imagePath: require("../../assets/banner/phone/banner5.jpeg") },
      { id: 5, name: "Mechanical Keyboard v2", price: 470, imagePath: require("../../assets/banner/phone/banner5.jpeg") },
      { id: 6, name: "Gaming Keyboard", price: 890, imagePath: require("../../assets/banner/phone/banner6.jpeg") },
      { id: 7, name: "Pro Keyboard", price: 1220, imagePath: require("../../assets/banner/phone/banner7.jpeg") },
      { id: 8, name: "Budget Keys", price: 155, imagePath: require("../../assets/banner/phone/banner3.jpeg") },
    ]);

    const addToCart = (product) => {
      try {
        const STORAGE_KEY = "MyCart";
        const currentCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

        // Add item with a unique cartId
        currentCart.push({
          ...product,
          cartId: Date.now() + Math.random(),
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentCart));

        $q.notify({
          message: `${product.name} added to your cart!`,
          color: "positive",
          icon: "shopping_bag",
          position: "bottom-right", // Changed position to not block the header
          timeout: 1500,
        });
      } catch (error) {
        console.error("Cart Error:", error);
        $q.notify({
          message: "Could not save to cart",
          color: "negative",
        });
      }
    };

    return { products, addToCart };
  },
};
</script>

<style scoped>

.product-card {
  border-radius: 16px; /* Slightly rounder for a modern look */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
}

.text-subtitle1 {
  line-height: 1.2;
  height: 2.4em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
} 
</style>