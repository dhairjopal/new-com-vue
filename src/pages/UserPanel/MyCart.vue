<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <div class="row items-center q-mb-md">
          <div class="text-h5 text-weight-bold">Shopping Cart</div>
          <q-badge color="primary" class="q-ml-sm" v-if="cartItems.length">
            {{ cartItems.length }} Items
          </q-badge>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-8">
            <q-card
              flat
              bordered
              v-if="cartItems.length > 0"
              class="overflow-hidden bg-white"
            >
              <q-list separator>
                <transition-group name="list">
                  <q-item
                    v-for="(item, index) in cartItems"
                    :key="item.cartId || index"
                    class="q-py-md"
                  >
                    <q-item-section avatar>
                      <q-img
                        :src="resolveImage(item.imagePath || item.image)"
                        class="rounded-borders shadow-1"
                        style="width: 80px; height: 80px"
                        fit="cover"
                      >
                        <template v-slot:error>
                          <div
                            class="absolute-full flex flex-center bg-grey-3 text-grey-8 text-caption text-center"
                          >
                            No Image
                          </div>
                        </template>
                      </q-img>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-subtitle1 text-weight-bold">{{
                        item.name
                      }}</q-item-label>
                      <q-item-label
                        caption
                        class="text-primary text-weight-medium"
                      >
                        Unit Price: ${{ Number(item.price).toLocaleString() }}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <div class="column items-center">
                        <div class="text-subtitle2 q-mb-xs">
                          ${{ Number(item.price).toLocaleString() }}
                        </div>
                        <q-btn
                          flat
                          round
                          dense
                          color="negative"
                          icon="delete_outline"
                          @click="removeFromCart(index)"
                        >
                          <q-tooltip>Remove Item</q-tooltip>
                        </q-btn>
                      </div>
                    </q-item-section>
                  </q-item>
                </transition-group>
              </q-list>
            </q-card>

            <q-card v-else flat bordered class="text-center q-pa-xl bg-white">
              <q-icon
                name="shopping_cart_checkout"
                size="100px"
                color="grey-3"
              />
              <div class="text-h6 text-grey-6 q-mt-md">
                Your cart is feeling lonely
              </div>
              <q-btn
                label="Go Shopping"
                color="primary"
                unelevated
                to="/"
                icon="storefront"
                class="q-mt-md"
                rounded
              />
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="sticky-summary bg-white">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Summary</div>
                <div class="row justify-between q-mb-sm text-grey-7">
                  <span>Subtotal ({{ cartItems.length }} items)</span>
                  <span>${{ cartTotal.toLocaleString() }}</span>
                </div>
                <div class="row justify-between q-mb-sm text-grey-7">
                  <span>Shipping</span>
                  <span class="text-green text-weight-bold">FREE</span>
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-between items-center">
                  <span class="text-subtitle1 text-weight-bold"
                    >Grand Total</span
                  >
                  <span class="text-h5 text-primary text-weight-bolder"
                    >${{ cartTotal.toLocaleString() }}</span
                  >
                </div>
              </q-card-section>
              <q-card-actions class="q-pa-md">
                <q-btn
                  color="primary"
                  label="Checkout Now"
                  class="full-width text-weight-bold"
                  size="lg"
                  unelevated
                  :disable="cartItems.length === 0"
                  @click="placeOrder"
                />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  name: "MyCart",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const cartItems = ref([]);

    onMounted(() => {
      // Ensure the key matches exactly what you use in HomePage
      const savedCart = localStorage.getItem("MyCart");
      if (savedCart) {
        cartItems.value = JSON.parse(savedCart);
      }
    });

    const cartTotal = computed(() => {
      return cartItems.value.reduce(
        (total, item) => total + Number(item.price),
        0,
      );
    });

    const resolveImage = (path) => {
      if (!path) return "";

      // 1. Handle Base64 strings (your current data) and External URLs
      if (
        path.startsWith("data:") ||
        path.startsWith("http") ||
        path.startsWith("/")
      ) {
        return path;
      }

      // 2. Handle local asset paths (fallback for older items)
      let cleanPath = path
        .replace("~assets/", "")
        .replace("src/assets/", "")
        .replace("assets/", "");

      try {
        return require(`../../assets/${cleanPath}`);
      } catch (error) {
        console.warn("Image resolution failed for:", path);
        return "";
      }
    };

    const removeFromCart = (index) => {
      $q.dialog({
        title: "Remove Item",
        message: "Are you sure you want to remove this?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        cartItems.value.splice(index, 1);
        localStorage.setItem("MyCart", JSON.stringify(cartItems.value));
        $q.notify({
          message: "Item removed",
          icon: "delete",
          color: "negative",
        });
      });
    };

    const placeOrder = () => {
      $q.loading.show({ message: "Processing Order..." });
      setTimeout(() => {
        const existingOrders = JSON.parse(
          localStorage.getItem("my_orders") || "[]",
        );
        existingOrders.unshift({
          id: "ORD-" + Math.floor(Math.random() * 100000),
          date: new Date().toLocaleString(),
          items: [...cartItems.value],
          total: cartTotal.value,
          status: "Confirmed",
        });
        localStorage.setItem("my_orders", JSON.stringify(existingOrders));
        cartItems.value = [];
        localStorage.removeItem("MyCart");
        $q.loading.hide();
        router.push("/user/my-order");
      }, 1200);
    };

    return { cartItems, cartTotal, resolveImage, removeFromCart, placeOrder };
  },
};
</script>

<style scoped>
.sticky-summary {
  position: sticky;
  top: 80px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.rounded-borders {
  border: 1px solid #e0e0e0;
}
</style>
