<template>
  <q-page padding class="bg-grey-2">
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <div class="text-h5 text-weight-bold">Super Admin Dashboard</div>
        <div class="text-subtitle2 text-grey-7">Real-time overview of your store performance.</div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-primary text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-70">Total Revenue</div>
                <div class="text-h4 text-weight-bolder">${{ stats.revenue }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="payments" size="lg" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-orange-8 text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-70">Orders Processed</div>
                <div class="text-h4 text-weight-bolder">{{ stats.orderCount }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="shopping_cart" size="lg" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-teal-8 text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-70">Active Products</div>
                <div class="text-h4 text-weight-bolder">{{ stats.productCount }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="inventory_2" size="lg" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-indigo-8 text-white">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 opacity-70">Total Customers</div>
                <div class="text-h4 text-weight-bolder">{{ stats.userCount }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="people" size="lg" class="opacity-50" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6">Recent Orders</div>
            <q-space />
            <q-btn flat color="primary" label="View All" to="/super-admin/all-orders" />
          </q-card-section>
          
          <q-separator />

          <q-table
            :rows="recentOrders"
            :columns="columns"
            row-key="id"
            flat
            hide-pagination
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.status === 'Delivered' ? 'positive' : 'orange'">
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Quick Actions</div>
          </q-card-section>
          <q-separator />
          <q-list padding>
            <q-item clickable v-ripple to="/super-admin/all-products">
              <q-item-section avatar>
                <q-icon name="add_circle" color="primary" />
              </q-item-section>
              <q-item-section>Add New Product</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/super-admin/user-management">
              <q-item-section avatar>
                <q-icon name="person_search" color="secondary" />
              </q-item-section>
              <q-item-section>Manage Users</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="exportData">
              <q-item-section avatar>
                <q-icon name="download" color="info" />
              </q-item-section>
              <q-item-section>Export Sales Report (CSV)</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'AdminDashboard',
  setup() {
    const $q = useQuasar()
    const recentOrders = ref([])
    
    const stats = reactive({
      revenue: 0,
      orderCount: 0,
      productCount: 0,
      userCount: 15 // Mocked static count
    })

    const columns = [
      { name: 'id', align: 'left', label: 'Order ID', field: 'id' },
      { name: 'total', align: 'center', label: 'Amount', field: 'total', format: val => `$${val}` },
      { name: 'status', align: 'center', label: 'Status', field: 'status' }
    ]

    const calculateDashboardStats = () => {
      // 1. Get Orders Data
      const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
      recentOrders.value = savedOrders.slice(0, 5) // Show only last 5
      
      stats.orderCount = savedOrders.length
      stats.revenue = savedOrders.reduce((acc, order) => acc + order.total, 0)

      // 2. Get Product Inventory Data
      const inventory = JSON.parse(localStorage.getItem('products_inventory') || '[]')
      stats.productCount = inventory.length
    }

    const exportData = () => {
      $q.notify({
        message: 'Report generating...',
        color: 'info',
        icon: 'cloud_download'
      })
    }

    onMounted(calculateDashboardStats)

    return {
      stats,
      recentOrders,
      columns,
      exportData
    }
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 15px;
  transition: transform 0.3s;
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-5px);
}
.opacity-70 {
  opacity: 0.7;
}
.opacity-50 {
  opacity: 0.5;
}
</style>