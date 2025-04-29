<template>
  <NavbarComponent :tasksViewActive="true" :projectId="projectId" />

  <section class="container">
    <div class="content-list">
      <div class="tools-container">
        <button @click="showAddTaskModal = true" class="light-purple-btn">
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Task
        </button>
        <button @click="handleDeleteDoneTasks"  :disabled="tasksDone.length === 0" :class="{ 'opacity-50 cursor-not-allowed': tasksDone.length === 0 }">
          <font-awesome-icon icon="fa-solid fa-trash" />
          Delete Tasks
        </button>
      </div>

      <div class="tasks-list">
        <div class="task-column">
          <div class="column-info">
            <div class="circle" style="background-color: #49c4e6"></div>
            <h2>To Do ({{ tasksTodo.length }})</h2>
          </div>

          <div class="task-column-content">
            <draggable
              v-model="tasksTodo"
              group="tasks"
              item-key="id"
              @change="evt => onTaskChange(evt, 'todo')"
            >
              <template #item="{ element: task }">
                <TaskItem :task="task" />
              </template>
            </draggable>
          </div>
        </div>

        <div class="task-column">
          <div class="column-info">
            <div class="circle" style="background-color: #655fc7"></div>
            <h2>Doing ({{ tasksDoing.length }})</h2>
          </div>

          <div class="task-column-content">
            <draggable
              v-model="tasksDoing"
              group="tasks"
              item-key="id"
              @change="evt => onTaskChange(evt, 'doing')"
            >
              <template #item="{ element: task }">
                <TaskItem :task="task" />
              </template>
            </draggable>
          </div>
        </div>

        <div class="task-column">
          <div class="column-info">
            <div class="circle" style="background-color: #68deb1"></div>
            <h2>Done ({{ tasksDone.length }})</h2>
          </div>

          <div class="task-column-content">
            <draggable
              v-model="tasksDone"
              group="tasks"
              item-key="id"
              @change="evt => onTaskChange(evt, 'done')"
            >
              <template #item="{ element: task }">
                <TaskItem :task="task" />
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </div>
  </section>

  <AddTask
    v-if="showAddTaskModal"
    :projectId="projectId"
    @onclosemodal="handleCloseModal"
    @ontaskadded="handleTaskAdded"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'
import NavbarComponent from "../components/NavbarComponent.vue"
import AddTask from '@/components/Modals/AddTask.vue'
import TaskItem from '@/components/TaskItem.vue'
import draggable from 'vuedraggable'
import { ref, onMounted } from "vue"
import { fetchTasksByProject, updateTaskStatus, deleteDoneTasks } from '@/composables/useTasks'

const route = useRoute()
const projectId = route.params.id

const showAddTaskModal = ref(false)

const handleCloseModal = () => {
  showAddTaskModal.value = false
  loadTasks()
}

const tasksTodo = ref([])
const tasksDoing = ref([])
const tasksDone = ref([])

const loadTasks = async () => {
  const tasks = await fetchTasksByProject(projectId)

  tasksTodo.value = tasks.filter(task => task.status === 'todo')
  tasksDoing.value = tasks.filter(task => task.status === 'doing')
  tasksDone.value = tasks.filter(task => task.status === 'done')
}


// UPDATE TASK STATUS
const onTaskChange = async (evt, newStatus) => {
  if (evt.added) {
    const movedTask = evt.added.element
    console.log("Moved task:", movedTask)
    
    if (movedTask) {
      await updateTaskStatus(movedTask.id, newStatus)
      // No need to reload tasks since v-model updates the arrays automatically
    }
  }
}

const handleDeleteDoneTasks = async () => {
  await deleteDoneTasks(projectId);
  await loadTasks(); // Refresh task lists
};


// LOAD TASKS WHENEVER THE PAGE IS LOADED
onMounted(() => {
  loadTasks()
})

</script>

<style lang="scss" scoped>
    @import "../../src/assets/style.scss";
    .tools-container{
      display: flex;
      justify-content: space-between;
    }
    .tasks-list{
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 33.33% 33.33% 33.33%;
        .task-column-content{
          min-height: 70vh;
        }
        h2{
            color: white;
        }
        .column-info{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        .circle{
            margin-right: 10px;
            height: 20px;
            width: 20px;
            border-radius: 50%;
        }
        .task-column-content, .task-column-empty{
            padding-top: 20px;
            padding-right: 20px;
        }
        .task-column-empty{
          color: white;
        }
    }
</style>