<template>
    <router-link :to="`/projects/${id}`" class="project-link">
      <div class="project-btn flex-column">
        <div class="upper-row">
            <h2 class="project-name">{{ props.name }}</h2>
        </div>
        <div class="mid-row">
            <p class="project-date">{{ props.date }} at {{ props.time }}</p>
        </div>
        <div class="lower-row flex-row">
          <div class="circle"></div>
          <p class="project-type">{{ projectType }}</p>
          <div class="circle" v-if="userRole !== null"></div>
          <p class="user-role" v-if="userRole !== null">{{ userRole }}</p>
        </div>
      </div>
    </router-link>
  </template>
  
  <script setup>

  import { defineProps, onMounted, ref } from "vue"
  import { determineProjectType } from "@/composables/useProjects";
  import { determineUserRole } from "@/composables/useProjects";

  const props = defineProps({
    id: String,
    name: String,
    date: String,
    time: String,
    ownerID: String,
    memberIDs: Array
  });

  let userRole = ref(null)
  let projectType = ref(null)

  onMounted(() =>{

      console.log(props.ownerID)
      console.log(props.memberIDs)

      userRole.value = determineUserRole(props.ownerID, props.memberIDs)
      projectType.value = determineProjectType(props.ownerID, props.memberIDs)
  })

  </script>
  
  <style lang="scss" scoped>
   @import "../assets/style.scss";

  .project-name {
    font-size: 1.7rem;
  }
  .project-date {
    font-size: 0.9rem;
    color: white;
    font-weight: normal;
    margin-top: 0.4rem;
  }
  .project-link{
    text-decoration: none;
  }
  .project-type, .user-role{
    margin-right: 1rem;
    font-weight: normal;
    font-size: 1rem;
  }
  .circle{
    height: 1rem;
    width: 1rem;
    background-color: $light;
    border-radius: 50%;
    margin-right: 0.3rem;
  }
  .flex-row{
    margin-top: 0.7rem;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .flex-column{
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  </style>
  