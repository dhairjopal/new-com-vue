<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12">
        
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h5 text-weight-bold">
            <q-icon name="admin_panel_settings" color="primary" class="q-mr-sm" />
            Super Admin: All Customer Orders
          </div>
          <q-chip outline color="primary" icon="shopping_bag">
            Total Orders: {{ allOrders.length }}
          </q-chip>
        </div>

        <q-card flat bordered>
          <q-table
            :rows="allOrders"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.row.status)"
                  text-color="white"
                  dense
                  class="text-weight-bold"
                >
                  {{ props.row.status }}
                </q-chip>
              </q-td>
            </template>

            <template v-slot:body-cell-items="props">
              <q-td :props="props">
                <div class="text-caption">
                  {{ props.row.items.length }} Items
                </div>
                <q-btn flat dense color="primary" label="View Items" size="sm" @click="viewItems(props.row)" />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn-dropdown
                  split
                  color="grey-7"
                  flat
                  dense
                  icon="settings"
                  label="Update Status"
                  size="sm"
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'Pending')">
                      <q-item-section>Pending</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'Delivered')">
                      <q-item-section>Delivered</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'Cancelled')">
                      <q-item-section class="text-negative">Cancelled</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </q-td>
            </template>
          </q-table>
        </q-card>

        <q-dialog v-model="detailsDialog">
          <q-card style="width: 400px">
            <q-card-section class="row items-center">
              <div class="text-h6">Order Details</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-list bordered separator>
                <q-item v-for="(item, i) in selectedOrder.items" :key="i">
                  <q-item-section avatar>
                    <q-avatar square>
                      <img :src="item.image">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ item.name }}</q-item-label>
                    <q-item-label caption>${{ item.price }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-dialog>

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'AllOrders',
  setup() {
    const $q = useQuasar()
    const allOrders = ref([])
    const detailsDialog = ref(false)
    const selectedOrder = ref({ items: [] })

    // Table Columns Configuration
    const columns = [
      { name: 'id', align: 'left', label: 'Order ID', field: 'id', sortable: true },
      { name: 'date', align: 'center', label: 'Date', field: 'date', sortable: true },
      { name: 'items', align: 'center', label: 'Products', field: 'items' },
      { name: 'total', align: 'center', label: 'Total Price', field: 'total', format: val => `$${val}` },
      { name: 'status', align: 'center', label: 'Status', field: 'status' },
      { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
    ]

    const loadAllOrders = () => {
      const data = localStorage.getItem('my_orders')
      allOrders.value = data ? JSON.parse(data) : []
    }

    const getStatusColor = (status) => {
      if (status === 'Pending') return 'orange'
      if (status === 'Delivered') return 'positive'
      if (status === 'Cancelled') return 'negative'
      return 'grey'
    }

    const viewItems = (order) => {
      selectedOrder.value = order
      detailsDialog.value = true
    }

    const updateStatus = (orderId, newStatus) => {
      const index = allOrders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        allOrders.value[index].status = newStatus
        // Save back to localStorage so the user sees the update too
        localStorage.setItem('my_orders', JSON.stringify(allOrders.value))
        
        $q.notify({
          message: `Order ${orderId} marked as ${newStatus}`,
          color: 'info',
          icon: 'update'
        })
      }
    }

    onMounted(loadAllOrders)

    return {
      allOrders,
      columns,
      detailsDialog,
      selectedOrder,
      getStatusColor,
      viewItems,
      updateStatus
    }
  }
}
</script>