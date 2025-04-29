<template>
    <div class="modal-container" @click="closeModal($event)">
      <div class="modal-window">
        <div class="modal-upper-row">
            <div class="task-title">
                <h1>{{ task.title }}</h1>
                <button class="edit-btn" v-if="!editTaskTitleActive" @click="handleEditTitle"><font-awesome-icon icon="fa-solid fa-pen" /></button>
            </div>
            <button @click="closeModal"><font-awesome-icon icon="fa-solid fa-xmark" /></button>
        </div>

        <div class="task-meta">
            <span class="date">{{ task.date }}</span>
            <span class="time">{{ task.time }}</span>
        </div>

        <div class="task-desc">
            <p>{{ task.description }}</p>
            <button class="edit-btn" v-if="!editTaskDescriptionActive" @click="handleEditDescription"><font-awesome-icon icon="fa-solid fa-pen" /></button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
    import { defineEmits, defineProps, onMounted } from 'vue';

    const props = defineProps({ task: Object })
    const emit = defineEmits(['onclosemodal'])

    const closeModal = (event) =>{
        if (event.target === event.currentTarget) {
            emit('onclosemodal');
        }
    }

    onMounted(() =>{
        console.log(props.task)
    })

  </script>

  <style lang="scss" scoped>
    @import "@/assets/style.scss";
    .task-title{
        display: flex;
        flex-direction: row;
    }
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