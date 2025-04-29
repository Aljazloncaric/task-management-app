<template>
    <NavbarComponent :tasksViewActive="false" /> 
  
    <section class="container">
      <div class="content-list projects-list">
        <!-- Add Button -->
        <div class="project-btn" @click="showModal = true">
          <font-awesome-icon icon="fa-solid fa-plus" style="margin-right: 10px" />
          New Project
        </div>
  
        <!-- Render Projects -->
        <ProjectItem
  v-for="project in projects"
  :key="project.id"
  :id="project.id"
  :name="project.name"
  :date="project.date"
  :time="project.time"
  :ownerID="project.ownerId"
  :memberIDs="project.memberIDs"
/>

      </div>
    </section>
  
    <AddProject v-if="showModal" @onclosemodal="handleModalClose"/>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import NavbarComponent from "../components/NavbarComponent.vue";
  import AddProject from "../components/Modals/AddProject.vue";
  import ProjectItem from "../components/ProjectItem.vue";
  import { getProjects } from '@/composables/useProjects';
  
  const showModal = ref(false);
  const projects = ref([]);
  
  async function fetchProjects() {
    projects.value = await getProjects();
  }
  
  function handleModalClose() {
    showModal.value = false;
    fetchProjects(); // refresh list after new project added
  }
  
  onMounted(() => {
    fetchProjects();
  });
  </script>

<style lang="scss" scoped>
@import "../../src/assets/style.scss";

.projects-list {
  // Other properties can be found in assets/style.scss - .content-list
  display: grid;
  grid-template-columns: 23% 23% 23% 23%;
  justify-content: space-between;
  align-content: start;
}

</style>
  