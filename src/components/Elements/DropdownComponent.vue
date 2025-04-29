<template>
    <div class="input-row">
      <label for="status">Status</label>
      <select
        id="status"
        class="status-dropdown"
        v-model="selectedStatus"
        @change="statusSelected"
      >
        <option
          v-for="status in statuses"
          :key="status.value"
          :value="status.value"
          class="option"
        >
          {{ status.name }}
        </option>
      </select>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, onMounted, defineEmits } from 'vue'
  
  // Props
  const props = defineProps({
    selected: String
  })
  
  // Emit
  const emit = defineEmits(['onStatusSelected'])
  
  // Reactive state
  const selectedStatus = ref(null)
  
  const statuses = [
    { name: 'Todo', value: 'todo' },
    { name: 'Doing', value: 'doing' },
    { name: 'Done', value: 'done' }
  ]
  
  // Watch for prop or set initially
  onMounted(() => {
    selectedStatus.value = props.selected
  })
  
  // Emit when status changes
  const statusSelected = () => {
    emit('onStatusSelected', selectedStatus.value)
  }
  </script>
  

<style lang="scss" scoped>
    @import "@/assets/style.scss";
    .status-dropdown{
        font-size: 20px;
        padding: 10px;
        background-color: $dark;
        color: $white;
        border: solid 2px $grey;
        &:after {
            content: '\25BC'; /* Unicode character for a downward-pointing triangle */
            position: absolute;
            top: 50%;
            right: 10px; /* Adjust the right position as needed */
            transform: translateY(-50%);
            color: #ff0000; /* Change the color of the arrow icon */
        }
        .option{
            padding: 10px;
        }
    }
</style>