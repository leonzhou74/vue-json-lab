<template>
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1 class="text-center">User Information Form</h1>
  
          <!-- Form (Vue validations; no HTML5 attributes) -->
          <form @submit.prevent="submitForm">
            <!-- Row 1 -->
            <div class="row mb-3">
              <div class="col-12 col-sm-6">
                <label for="username" class="form-label">Username</label>
                <input
                  id="username"
                  type="text"
                  class="form-control"
                  v-model="formData.username"
                  @blur="() => validateName(true)"
                  @input="() => validateName(false)"
                />
                <div v-if="errors.username" class="text-danger mt-1">
                  {{ errors.username }}
                </div>
              </div>
  
              <div class="col-12 col-sm-6">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="formData.password"
                  @blur="() => validatePassword(true)"
                  @input="() => validatePassword(false)"
                />
                <div class="form-text">
                  At least 8 chars, incl. 1 uppercase, 1 lowercase, 1 number, 1 special.
                </div>
                <div v-if="errors.password" class="text-danger mt-1">
                  {{ errors.password }}
                </div>
              </div>
            </div>
  
            <!-- Row 2 -->
            <div class="row mb-3">
              <div class="col-12 col-sm-6">
                <div class="form-check mt-2">
                  <input
                    id="isAustralian"
                    type="checkbox"
                    class="form-check-input"
                    v-model="formData.isAustralian"
                    @change="() => validateResident(true)"
                  />
                  <label class="form-check-label" for="isAustralian">
                    Australian Resident?
                  </label>
                </div>
                <div v-if="errors.resident" class="text-danger mt-1">
                  {{ errors.resident }}
                </div>
              </div>
  
              <div class="col-12 col-sm-6">
                <label for="gender" class="form-label">Gender</label>
                <select
                  id="gender"
                  class="form-select"
                  v-model="formData.gender"
                  @change="() => validateGender(true)"
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div v-if="errors.gender" class="text-danger mt-1">
                  {{ errors.gender }}
                </div>
              </div>
            </div>
  
            <!-- Row 3 -->
            <div class="mb-3">
              <label for="reason" class="form-label">Reason for joining</label>
              <textarea
                id="reason"
                rows="3"
                class="form-control"
                v-model="formData.reason"
                @blur="() => validateReason(true)"
                @input="() => validateReason(false)"
              />
              <div v-if="errors.reason" class="text-danger mt-1">
                {{ errors.reason }}
              </div>
            </div>
  
            <div class="text-center">
              <button type="submit" class="btn btn-primary me-2">Submit</button>
              <button type="button" class="btn btn-secondary" @click="clearForm">
                Clear
              </button>
            </div>
          </form>
  
          <!-- PrimeVue DataTable -->
          <DataTable
  v-if="submittedCards.length"
  :value="submittedCards"
  class="mt-4"
  style="width: 100%" 
  stripedRows
  paginator
  :rows="5"
  :rowsPerPageOptions="[5,10,20]"
  :sortMode="'multiple'"
  removableSort
>

            <Column field="username" header="Username" sortable />
            <Column field="password" header="Password" />
            <Column header="Australian?" sortable>
              <template #body="{ data }">
                {{ data.isAustralian ? 'Yes' : 'No' }}
              </template>
            </Column>
            <Column field="gender" header="Gender" sortable />
            <Column field="reason" header="Reason" />
          </DataTable>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import DataTable from 'primevue/datatable'
  import Column from 'primevue/column'
  
  const formData = ref({
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
  })
  
  const submittedCards = ref([])
  
  const errors = ref({
    username: null,
    password: null,
    resident: null,
    gender: null,
    reason: null
  })
  
  /* --- Username: >= 3 chars --- */
  const validateName = (blur) => {
    if ((formData.value.username || '').length < 3) {
      if (blur) errors.value.username = 'Name must be at least 3 characters'
    } else {
      errors.value.username = null
    }
  }
  
  /* --- Password: >=8, upper, lower, number, special --- */
  const validatePassword = (blur) => {
    const password = formData.value.password || ''
    const minLength = 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  
    if (password.length < minLength) {
      if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
    } else if (!hasUppercase) {
      if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
    } else if (!hasLowercase) {
      if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
    } else if (!hasNumber) {
      if (blur) errors.value.password = 'Password must contain at least one number.'
    } else if (!hasSpecialChar) {
      if (blur) errors.value.password = 'Password must contain at least one special character.'
    } else {
      errors.value.password = null
    }
  }
  
  /* --- Resident: must be checked --- */
  const validateResident = (blur) => {
    if (!formData.value.isAustralian) {
      if (blur) errors.value.resident = 'Please confirm your residency.'
    } else {
      errors.value.resident = null
    }
  }
  
  /* --- Gender: required --- */
  const validateGender = (blur) => {
    if (!(formData.value.gender || '').trim()) {
      if (blur) errors.value.gender = 'Please select a gender.'
    } else {
      errors.value.gender = null
    }
  }
  
  /* --- Reason: >= 10 chars --- */
  const validateReason = (blur) => {
    const txt = (formData.value.reason || '').trim()
    if (txt.length < 10) {
      if (blur) errors.value.reason = 'Please enter at least 10 characters.'
    } else {
      errors.value.reason = null
    }
  }
  
  /* Submit: validate all; only add a row if no errors */
  const submitForm = () => {
    validateName(true)
    validatePassword(true)
    validateResident(true)
    validateGender(true)
    validateReason(true)
  
    const hasErrors = Object.values(errors.value).some(Boolean)
    if (!hasErrors) {
      submittedCards.value.push({ ...formData.value })
      clearForm()
    }
  }
  
  const clearForm = () => {
    formData.value = {
      username: '',
      password: '',
      isAustralian: false,
      reason: '',
      gender: ''
    }
    errors.value = {
      username: null,
      password: null,
      resident: null,
      gender: null,
      reason: null
    }
  }
  </script>
  
  <style scoped>

  </style>