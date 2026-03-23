<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> SuperAdmin Panel </q-toolbar-title>

        <q-btn flat icon="exit_to_app" label="Logout" to="/" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-list>
        <q-item-label header> Administration </q-item-label>

        <q-item clickable v-ripple to="/admin/dashboard" exact>
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/all-orders">
          <q-item-section avatar
            ><q-icon name="shopping_basket"
          /></q-item-section>
          <q-item-section>All Orders</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/all-products">
          <q-item-section avatar><q-icon name="inventory_2" /></q-item-section>
          <q-item-section>All Products</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/admin/all-users">
          <q-item-section avatar><q-icon name="group" /></q-item-section>
          <q-item-section>All Users</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  name: "AdminLayout",
  setup() {
    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
};
</script>
