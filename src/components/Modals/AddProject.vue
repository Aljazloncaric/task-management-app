<template>
    <main class="modal-container" @click="closeModal($event)">
      <form class="modal-window" @submit.prevent="handleConfirm">
        <div class="modal-upper-row">
          <h1 class="modal-title">New Project</h1>
          <button class="close-btn" type="button" @click="emit('onclosemodal')">
            <font-awesome-icon icon="fa fa-xmark" />
          </button>
        </div>
        <div class="error-message" v-if="errorMessage">
          <p>{{ errorMessage }}</p>
        </div>
        <input
          type="text"
          placeholder="Enter Project Name"
          class="board-name-input"
          v-model="inputText"
          style="margin-bottom: 20px;"
        />
        <button class="light-purple-btn" type="submit">Confirm</button>
      </form>
    </main>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  import { checkIfProjectExists, createProject } from '@/composables/useProjects';
  
  const inputText = ref('');
  const errorMessage = ref(null);
  const emit = defineEmits(['onclosemodal']);
  
  const closeModal = (event) => {
    if (event.target === event.currentTarget) {
      emit('onclosemodal');
    }
  }
  
  async function handleConfirm() {
    const name = inputText.value.trim();
  
    if (!name) {
      errorMessage.value = 'Project name cannot be empty.';
      return;
    }
  
    const exists = await checkIfProjectExists(name);
    if (exists) {
      errorMessage.value = 'A project with this name already exists.';
      return;
    }
  
    try {
      await createProject(name);
      emit('onclosemodal');
    } catch (error) {
      errorMessage.value = 'Something went wrong. Try again.';
      console.error(error);
    }
  }
  </script>
  
  <style lang="scss" scoped>
  @import "@/assets/style.scss";
  
  .upper-row-container {
    @include flex-row();
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  

  </style>
  