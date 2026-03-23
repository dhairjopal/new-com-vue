<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <div class="row items-center justify-between q-mb-lg">
          <div class="text-h5 text-weight-bold text-primary">
            <q-icon name="place" size="sm" class="q-mr-sm" />
            My Addresses
          </div>
          <q-btn
            label="Add New Address"
            color="primary"
            icon="add"
            unelevated
            rounded
            @click="openAddressDialog()"
          />
        </div>

        <div v-if="addresses.length > 0" class="row q-col-gutter-md">
          <div v-for="(addr, index) in addresses" :key="addr.id" class="col-12">
            <q-card flat bordered class="address-card">
              <q-card-section row class="items-start">
                <div class="row items-center no-wrap">
                  <q-icon
                    :name="addr.isDefault ? 'check_circle' : 'location_on'"
                    :color="addr.isDefault ? 'positive' : 'grey-7'"
                    size="md"
                    class="q-mr-md"
                  />
                  <div>
                    <div class="text-subtitle1 text-weight-bold">
                      {{ addr.receiverName }}
                      <q-badge
                        v-if="addr.isDefault"
                        color="green-1"
                        text-color="green-9"
                        label="Default"
                        class="q-ml-sm"
                      />
                    </div>
                    <div class="text-grey-8">{{ addr.phone }}</div>
                    <div class="text-grey-9 q-mt-xs">
                      {{ addr.street }}, {{ addr.city }}, {{ addr.state }} -
                      {{ addr.zip }}
                    </div>
                  </div>
                </div>

                <q-space />

                <div class="column justify-between">
                  <q-btn
                    flat
                    round
                    color="grey-7"
                    icon="edit"
                    @click="openAddressDialog(addr, index)"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    color="negative"
                    icon="delete_outline"
                    @click="deleteAddress(index)"
                  >
                    <q-tooltip>Delete</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card
          v-else
          flat
          bordered
          class="text-center q-pa-xl bg-white rounded-borders"
        >
          <q-icon name="map" size="80px" color="grey-3" />
          <div class="text-h6 text-grey-5 q-mt-md">No addresses saved yet</div>
          <q-btn
            label="Add your first address"
            color="primary"
            flat
            class="q-mt-sm"
            @click="openAddressDialog()"
          />
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px; border-radius: 15px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ isEditing ? "Edit Address" : "New Address" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveAddress" class="q-gutter-md">
            <q-input
              v-model="form.receiverName"
              label="Full Name"
              outlined
              dense
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              v-model="form.phone"
              label="Phone Number"
              outlined
              dense
              mask="###########"
              :rules="[(val) => !!val || 'Required']"
            />
            <q-input
              v-model="form.street"
              label="Street Address / Building"
              outlined
              dense
              :rules="[(val) => !!val || 'Required']"
            />

            <div class="row q-col-gutter-sm">
              <q-input
                v-model="form.city"
                label="City"
                outlined
                dense
                class="col-6"
              />
              <q-input
                v-model="form.zip"
                label="Zip Code"
                outlined
                dense
                class="col-6"
              />
            </div>

            <q-checkbox
              v-model="form.isDefault"
              label="Set as default address"
              color="primary"
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup />
              <q-btn
                :label="isEditing ? 'Update' : 'Save'"
                color="primary"
                type="submit"
                unelevated
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "MyAddress",
  setup() {
    const $q = useQuasar();
    const STORAGE_KEY = "user_addresses";

    const addresses = ref([]);
    const showDialog = ref(false);
    const isEditing = ref(false);
    const editingIndex = ref(-1);

    const form = ref({
      id: null,
      receiverName: "",
      phone: "",
      street: "",
      city: "",
      state: "NY",
      zip: "",
      isDefault: false,
    });

    // LOAD (Read)
    onMounted(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        addresses.value = JSON.parse(saved);
      }
    });

    const openAddressDialog = (item = null, index = -1) => {
      if (item) {
        isEditing.value = true;
        editingIndex.value = index;
        form.value = { ...item };
      } else {
        isEditing.value = false;
        form.value = {
          id: Date.now(),
          receiverName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          isDefault: false,
        };
      }
      showDialog.value = true;
    };

    // CREATE & UPDATE
    const saveAddress = () => {
      // If setting as default, unset others
      if (form.value.isDefault) {
        addresses.value.forEach((a) => (a.isDefault = false));
      }

      if (isEditing.value) {
        addresses.value[editingIndex.value] = { ...form.value };
        $q.notify({
          message: "Address updated",
          color: "positive",
          icon: "edit",
        });
      } else {
        addresses.value.push({ ...form.value });
        $q.notify({
          message: "Address added",
          color: "positive",
          icon: "add_location",
        });
      }

      syncToLS();
      showDialog.value = false;
    };

    // DELETE
    const deleteAddress = (index) => {
      $q.dialog({
        title: "Delete Address",
        message: "Are you sure you want to remove this address?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        addresses.value.splice(index, 1);
        syncToLS();
        $q.notify({
          message: "Address deleted",
          color: "negative",
          icon: "delete",
        });
      });
    };

    const syncToLS = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses.value));
    };

    return {
      addresses,
      showDialog,
      form,
      isEditing,
      openAddressDialog,
      saveAddress,
      deleteAddress,
    };
  },
};
</script>

<style scoped>
.address-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
}
.address-card:hover {
  border-color: var(--q-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>
