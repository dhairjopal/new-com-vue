<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12">
        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div class="text-h5 text-weight-bold">Registered Users</div>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search users...">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
          </q-card-section>

          <q-table
            :rows="users"
            :columns="columns"
            row-key="email"
            :filter="filter"
            flat
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.active ? 'positive' : 'negative'">
                  {{ props.row.active ? 'Active' : 'Banned' }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn flat round dense color="primary" icon="visibility" @click="viewUserOrders(props.row.email)" />
                <q-btn 
                  flat round dense 
                  :color="props.row.active ? 'negative' : 'positive'" 
                  :icon="props.row.active ? 'block' : 'check_circle'" 
                  @click="toggleUserStatus(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'UserManagement',
  setup() {
    const $q = useQuasar()
    const filter = ref('')
    const users = ref([
      { name: 'John Doe', email: 'john@example.com', role: 'User', active: true, joined: '2023-10-01' },
      { name: 'Jane Smith', email: 'jane@test.com', role: 'User', active: true, joined: '2023-11-15' },
      { name: 'Admin One', email: 'admin@site.com', role: 'Admin', active: true, joined: '2023-01-01' }
    ])

    const columns = [
      { name: 'name', label: 'Full Name', field: 'name', align: 'left', sortable: true },
      { name: 'email', label: 'Email', field: 'email', align: 'left' },
      { name: 'role', label: 'Role', field: 'role', align: 'center' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
      { name: 'actions', label: 'Actions', align: 'right' }
    ]

    const toggleUserStatus = (user) => {
      user.active = !user.active
      $q.notify({
        message: `User ${user.active ? 'Activated' : 'Suspended'}`,
        color: user.active ? 'positive' : 'negative',
        position: 'bottom-right'
      })
    }

    const viewUserOrders = (email) => {
      // Logic to filter the AllOrders page by this email
      $q.notify({ message: `Viewing orders for ${email}`, color: 'info' })
    }

    return { users, columns, filter, toggleUserStatus, viewUserOrders }
  }
}
</script>