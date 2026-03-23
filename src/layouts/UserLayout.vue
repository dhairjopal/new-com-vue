<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> User Dashboard </q-toolbar-title>

        <q-btn flat icon="store" label="Back to Store" to="/" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list>
        <q-item-label header> User Menu </q-item-label>

        <q-item clickable v-ripple to="/user/my-profile">
          <q-item-section avatar><q-icon name="person" /></q-item-section>
          <q-item-section>My Profile</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/user/my-order">
          <q-item-section avatar><q-icon name="list_alt" /></q-item-section>
          <q-item-section>My Orders</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/user/my-address">
          <q-item-section avatar><q-icon name="place" /></q-item-section>
          <q-item-section>My Address</q-item-section>
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
  name: "UserLayout",
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
