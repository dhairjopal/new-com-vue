<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        
        <div class="row items-center justify-between q-mb-lg">
          <div>
            <div class="text-h5 text-weight-bold">My Order History</div>
            <div class="text-subtitle2 text-grey-7">
              You have placed **{{ orders.length }}** orders with a total of **{{ totalProductsOrdered }}** items.
            </div>
          </div>
          <q-btn outline color="negative" label="Clear History" icon="delete_sweep" @click="clearOrders" v-if="orders.length > 0" />
        </div>

        <div v-if="orders.length > 0">
          <q-card v-for="order in orders" :key="order.id" flat bordered class="q-mb-md overflow-hidden">
            <q-card-section class="row items-center justify-between bg-white border-bottom">
              <div class="column">
                <span class="text-caption text-grey-7 uppercase">Order ID</span>
                <span class="text-weight-bold text-primary">{{ order.id }}</span>
              </div>
              <div class="column text-center">
                <span class="text-caption text-grey-7 uppercase">Date</span>
                <span class="text-weight-bold">{{ order.date }}</span>
              </div>
              <div class="column text-center">
                <span class="text-caption text-grey-7 uppercase">Items</span>
                <q-badge color="blue-1" text-color="blue-9" class="text-weight-bold">
                  {{ order.items.length }} Products
                </q-badge>
              </div>
              <div class="column text-right">
                <q-chip :color="getStatusColor(order.status)" text-color="white" dense>
                  {{ order.status }}
                </q-chip>
              </div>
            </q-card-section>

            <q-list separator>
              <q-item v-for="(item, idx) in order.items" :key="idx" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar square size="50px">
                    <img :src="item.image">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
                  <q-item-label caption>Product ID: #{{ item.id }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="text-subtitle1 text-weight-bold text-black">${{ item.price }}</div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-separator />

            <q-card-section class="row justify-end items-center q-py-sm bg-grey-1">
              <div class="text-grey-7 q-mr-md text-subtitle2">Total Amount Paid:</div>
              <div class="text-h6 text-weight-bolder text-primary">${{ order.total }}</div>
            </q-card-section>
          </q-card>
        </div>

        <div v-else class="column items-center q-pa-xl text-grey-6 border-dashed">
          <q-icon name="shopping_bag" size="80px" color="grey-4" />
          <div class="text-h6 q-mt-md">No orders found</div>
          <p>You haven't placed any orders yet.</p>
          <q-btn color="primary" label="Start Shopping" to="/" unelevated />
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'MyOrders',
  setup() {
    const $q = useQuasar()
    const orders = ref([])

    // Load orders from LocalStorage
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('my_orders')
      if (savedOrders) {
        orders.value = JSON.parse(savedOrders)
      }
    }

    // Computed: Total number of individual products across all orders
    const totalProductsOrdered = computed(() => {
      return orders.value.reduce((total, order) => total + order.items.length, 0)
    })

    const getStatusColor = (status) => {
      switch (status) {
        case 'Pending': return 'orange';
        case 'Delivered': return 'positive';
        case 'Cancelled': return 'negative';
        default: return 'grey';
      }
    }

    const clearOrders = () => {
      $q.dialog({
        title: 'Clear History',
        message: 'This will delete all your order records. Proceed?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        localStorage.removeItem('my_orders')
        orders.value = []
        $q.notify({ message: 'Order history cleared', color: 'black' })
      })
    }

    onMounted(loadOrders)

    return {
      orders,
      totalProductsOrdered,
      getStatusColor,
      clearOrders
    }
  }
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #e0e0e0;
}
.border-dashed {
  border: 2px dashed #bdbdbd;
  border-radius: 15px;
}
.uppercase {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 10px;
}
</style>