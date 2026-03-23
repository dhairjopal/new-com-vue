<template>
  <q-page padding class="bg-grey-2 flex flex-center">
    <div class="col-12 col-md-6" style="width: 100%; max-width: 800px;">
      
      <q-card flat bordered class="q-mb-md bg-white">
        <q-card-section class="column items-center">
          <q-avatar size="120px" font-size="52px" color="primary" text-color="white">
            <img v-if="userForm.profilePic" :src="userForm.profilePic">
            <q-icon v-else name="person" />
          </q-avatar>
          
          <div class="text-h5 q-mt-md text-weight-bold">
            {{ userForm.firstName }} {{ userForm.lastName }}
          </div>
          <div class="text-grey-7 q-mb-md">{{ userForm.email || 'No email provided' }}</div>
          
          <q-btn 
            outline 
            color="primary" 
            icon="photo_camera" 
            label="Change Picture" 
            @click="triggerFilePicker"
          />
          <input 
            type="file" 
            ref="fileInput" 
            style="display: none" 
            accept="image/*" 
            @change="onFileChange"
          >
        </q-card-section>
      </q-card>

      <q-card flat bordered class="bg-white">
        <q-tabs 
          v-model="tab" 
          dense 
          class="text-grey" 
          active-color="primary" 
          indicator-color="primary" 
          align="justify"
        >
          <q-tab name="details" icon="edit" label="Account Details" />
          <q-tab name="security" icon="lock" label="Security" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="details" class="q-gutter-y-md">
            <div class="row q-col-gutter-md">
              <q-input 
                filled 
                v-model="userForm.firstName" 
                label="First Name" 
                class="col-12 col-sm-6" 
              />
              <q-input 
                filled 
                v-model="userForm.lastName" 
                label="Last Name" 
                class="col-12 col-sm-6" 
              />
            </div>
            
            <q-input filled v-model="userForm.email" label="Email" type="email" />
            <q-input filled v-model="userForm.phone" label="Phone Number" mask="###########" />
             <q-input filled v-model="userForm.password" label="Password"  />


            <div class="row justify-end q-mt-lg">
              <q-btn 
                label="Save Changes" 
                color="primary" 
                unelevated 
                :loading="saving"
                @click="saveProfile" 
              />
            </div>
          </q-tab-panel>

          <q-tab-panel name="security">
            <div class="text-h6 q-mb-md">Change Password</div>
            <div class="q-gutter-md">
              <q-input filled type="password" label="Current Password" dense />
              <q-input filled type="password" label="New Password" dense />
              <q-btn label="Update Password" color="black" unelevated />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'UserProfile',
  setup() {
    const $q = useQuasar()
    const tab = ref('details')
    const saving = ref(false)
    const fileInput = ref(null)
    const STORAGE_KEY = 'user_profile_data'

    // Form State (Default values)
    const userForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profilePic: null
    })

    // 1. LOAD DATA: When component is created/reloaded
    onMounted(() => {
      const savedData = localStorage.getItem(STORAGE_KEY)
      if (savedData) {
        try {
          userForm.value = JSON.parse(savedData)
        } catch (e) {
          console.error("Failed to parse profile data:", e)
        }
      }
    })

    // 2. SAVE DATA: Triggered by "Save Changes" button
    const saveProfile = () => {
      saving.value = true
      
      // Artificial delay to show loading state
      setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userForm.value))
          $q.notify({
            type: 'positive',
            message: 'Profile saved successfully!',
            position: 'top',
            timeout: 1500
          })
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Storage full or error saving data',
          })
        } finally {
          saving.value = false
        }
      }, 700)
    }

    // 3. IMAGE UPLOAD: Convert image to Base64 to store in LS
    const triggerFilePicker = () => {
      fileInput.value.click()
    }
    
    const onFileChange = (e) => {
      const file = e.target.files[0]
      if (file) {
        // Validate file size (optional but recommended for LS, e.g., < 2MB)
        if (file.size > 2 * 1024 * 1024) {
          $q.notify({ color: 'negative', message: 'Image too large (max 2MB)' })
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          userForm.value.profilePic = event.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    return {
      tab,
      userForm,
      saving,
      saveProfile,
      fileInput,
      triggerFilePicker,
      onFileChange
    }
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
/* Ensure the image looks good in the circular avatar */
.q-avatar img {
  object-fit: cover;
}
</style>