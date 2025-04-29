<template>
    <div class="task-card flex-column" >
      <h3 class="task-title">{{ props.task.title }}</h3>
      <div class="task-meta">
        <span class="date">{{ props.task.date }}</span>
        <span class="time">{{ props.task.time }}</span>
      </div>
      <p class="task-desc">
        {{ truncatedDescription }}
      </p>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from "vue";
  
  const props = defineProps({ task: Object });
  
  const truncatedDescription = computed(() => {
    return props.task.description.length > 40
      ? props.task.description.slice(0, 40) + '...'
      : props.task.description;
  });
  </script>

  <style lang="scss" scoped>
   @import "../assets/style.scss";
    .task-card{
        width: 100%;
        color: white;
        background-color: $dark;
        margin-bottom: 20px;
        padding: 1rem;
        border-radius: 1.5rem;
        cursor: pointer;
        .task-title{
            font-size: 1.5rem;
        }
        .task-meta{
            display: flex;
            flex-direction: row;
            font-size: 0.75rem;
            padding-bottom: 0.5rem;
            .date{
                margin-right: 0.5rem;
            }
        }
    }
  </style>
  