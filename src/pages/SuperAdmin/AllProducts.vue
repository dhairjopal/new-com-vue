<template>
  <q-page padding class="bg-grey-2">
    <div class="row justify-center">
      <div class="col-12">
        
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center justify-between">
            <div class="text-h5 text-weight-bold">
              <q-icon name="inventory_2" color="primary" class="q-mr-sm" />
              Product Management
            </div>
            <div class="q-gutter-sm">
              <q-btn color="secondary" icon="refresh" label="Sync Default Products" @click="syncDefaultProducts" />
              <q-btn color="primary" icon="add" label="Add New Product" @click="openProductDialog()" />
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-table
            :rows="productList"
            :columns="columns"
            row-key="id"
            :filter="filter"
            flat
          >
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search Products">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-avatar square size="40px">
                  <img :src="props.row.image">
                </q-avatar>
              </q-td>
            </template>

            <template v-slot:body-cell-price="props">
              <q-td :props="props" class="text-weight-bold text-primary">
                ${{ props.row.price }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-xs">
                <q-btn flat round color="blue" icon="edit" size="sm" @click="openProductDialog(props.row, props.pageIndex)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteProduct(props.pageIndex)" />
              </q-td>
            </template>
          </q-table>
        </q-card>

        <q-dialog v-model="showDialog" persistent>
          <q-card style="width: 400px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">{{ isEditing ? 'Edit Product' : 'New Product' }}</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section>
              <q-form @submit="saveProduct" class="q-gutter-md">
                <q-input outlined dense v-model="form.name" label="Product Name" required />
                <q-input outlined dense v-model.number="form.price" type="number" label="Price" prefix="$" />
                <q-input outlined dense v-model="form.image" label="Image Path (src/assets/...)" />
                
                <div class="row justify-end q-mt-md">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn color="primary" :label="isEditing ? 'Update' : 'Create'" type="submit" unelevated />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'AllProducts',
  setup() {
    const $q = useQuasar()
    const productList = ref([])
    const showDialog = ref(false)
    const isEditing = ref(false)
    const editIndex = ref(-1)
    const filter = ref('')

    const columns = [
      { name: 'image', align: 'left', label: 'Image', field: 'image' },
      { name: 'name', align: 'left', label: 'Product Name', field: 'name', sortable: true },
      { name: 'price', align: 'center', label: 'Price', field: 'price', sortable: true },
      { name: 'actions', align: 'right', label: 'Actions', field: 'actions' }
    ]

    const form = reactive({
      id: null,
      name: '',
      price: 0,
      image: ''
    })

    const loadProducts = () => {
      const saved = localStorage.getItem('products_inventory')
      productList.value = saved ? JSON.parse(saved) : []
    }

    const syncDefaultProducts = () => {
      const defaults = [
        { id: 1, name: 'Wireless Headphones', price: 550, image: 'src/assets/banner/phone/banner2.jpeg' },
        { id: 2, name: 'Smart Watch', price: 330, image: 'src/assets/banner/phone/banner3.jpeg' },
        { id: 3, name: 'Gaming Mouse', price: 2240, image: 'src/assets/banner/phone/banner8.jpeg' },
        { id: 4, name: 'Mechanical Keyboard', price: 990, image: 'src/assets/banner/phone/banner5.jpeg' }
      ]
      localStorage.setItem('products_inventory', JSON.stringify(defaults))
      loadProducts()
      $q.notify({ message: 'Default products synced!', color: 'secondary' })
    }

    const openProductDialog = (product = null, index = -1) => {
      if (product) {
        isEditing.value = true
        editIndex.value = index
        Object.assign(form, product)
      } else {
        isEditing.value = false
        form.id = Date.now()
        form.name = ''
        form.price = 0
        form.image = 'src/assets/banner/phone/banner1.jpeg'
      }
      showDialog.value = true
    }

    const saveProduct = () => {
      if (isEditing.value) {
        productList.value[editIndex.value] = { ...form }
      } else {
        productList.value.push({ ...form })
      }
      localStorage.setItem('products_inventory', JSON.stringify(productList.value))
      showDialog.value = false
      $q.notify({ type: 'positive', message: 'Inventory Updated' })
    }

    const deleteProduct = (index) => {
      $q.dialog({ title: 'Confirm', message: 'Delete this product?', cancel: true }).onOk(() => {
        productList.value.splice(index, 1)
        localStorage.setItem('products_inventory', JSON.stringify(productList.value))
      })
    }

    onMounted(loadProducts)

    return {
      productList, columns, filter, showDialog, isEditing, form,
      syncDefaultProducts, openProductDialog, saveProduct, deleteProduct
    }
  }
}
</script>