<template>
    <main class="modal-container" @click="closeModal($event)">
      <form class="modal-window" @submit.prevent="handleConfirm">
        <div class="modal-upper-row">
          <h1 class="modal-title">Add New Task </h1>
          <button class="close-btn" type="button" @click="emit('onclosemodal')">
            <font-awesome-icon icon="fa fa-times" />
          </button>
        </div>
        
        <div class="error-message" v-if="errorMessage">
          <p>{{ errorMessage }}</p>
        </div>
        <div class="input-row">
          <label for="title">Title</label>
          <input
            v-model="formData.title"
            type="text"
            id="title"
            placeholder="e. g. Take coffee break"
          />
        </div>
  
        <div class="input-row">
          <label for="description">Description</label>
          <textarea
            v-model="formData.description"
            id="description"
            cols="30"
            rows="6"
            placeholder="e. g. It is always good to take a break. This 15 minute break will recharge the batteries a little"
          ></textarea>
        </div>

        <DropdownComponent :selected="selectedStatus" @onStatusSelected="changeStatus" />
  
        <button class="light-purple-btn" type="submit">
          Save
        </button>
      </form>
    </main>
  </template>
  

<script setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import DropdownComponent from '../Elements/DropdownComponent.vue'
import { createTask } from '@/composables/useTasks';

const selectedStatus = ref("todo")
const errorMessage = ref(null)

const props = defineProps({
  projectId: String
})

const emit = defineEmits(['onclosemodal', 'ontaskadded'])

const formData = ref({
  title: "",
  description: "",
  status: "",
})

onMounted(() => {
  formData.value.status = selectedStatus.value
})

function changeStatus(value) {
  formData.value.status = value
}

const closeModal = (event) => {
  if (event.target === event.currentTarget) {
      emit('onclosemodal');
      formData.value.title = ""
      formData.value.description = ""
      formData.value.status = "todo"
      selectedStatus.value = "todo"
    }
}


const handleConfirm = async () => {

  const title = formData.value.title.trim()
  const description = formData.value.description.trim()

  if (!title) {
      errorMessage.value = 'Title cannot be empty.';
      return;
  }

  try {
    await createTask({
      title: title,
      description: description,
      status: formData.value.status
    }, props.projectId); // assuming projectId is passed as a prop

    emit('onclosemodal')
    // emit('ontaskadded'); // optional, if you want to refresh task list
  } catch (error) {
    errorMessage.value = "Something went wrong. Try again."
    console.error('Error saving task:', error);
  }
};


</script>

<style lang="scss" scoped>
    @import "@/assets/style.scss";
</style>