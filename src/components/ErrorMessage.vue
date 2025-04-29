<template>
    <div class="error-message">
          <p>{{ props.errorMsg }}</p>
    </div>
</template>

<script setup>
    import { defineProps } from "vue"
    const props = defineProps(["errorMsg"]);
</script>

<style lang="scss" scoped>
@import "@/assets/style.scss";
.error-message {
    width: 100%;
    background-color: rgb(177, 48, 48);
    color: $white;
    padding: 5px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
</style>
