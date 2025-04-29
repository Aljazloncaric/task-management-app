<template>
    <div class="modal-container" @click="closeModal($event)">
      <div class="modal-window">
        <div class="modal-upper-row">
            <h1>Delete the project?</h1>
            <button @click="closeModal"><font-awesome-icon icon="fa-solid fa-xmark" /></button>
        </div>
        <h4>All associated tasks will be lost. This action cannot be undone.</h4>
        <div>
            <button @click="confirmDelete" style="margin-right: 1rem;" class="red-btn"><font-awesome-icon icon="fa-solid fa-check" /> Confirm</button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
    import { defineEmits } from 'vue';
    import { useRouter, useRoute } from "vue-router"
    import { deleteProject } from '@/composables/useProjects';
    import { deleteTasksByProject } from '@/composables/useTasks';

    const emit = defineEmits(['onclosemodal'])

    const router = useRouter()
    const route = useRoute();

    const confirmDelete = async () =>{

        const projectId = route.params.id;

        await deleteTasksByProject(projectId);
        await deleteProject(projectId);
        router.push("/projects")
    }

    const closeModal = (event) =>{
        if (event.target === event.currentTarget) {
            emit('onclosemodal');
        }
    }

  </script>

  <style lang="scss" scoped>
    @import "@/assets/style.scss";
    h1, h4{
        color: white;
    }
    h1{
        font-size: 2rem;
    }
    h4{
        font-size: 1rem;
        font-weight: normal;
        margin: 1rem 0;
    }
</style>