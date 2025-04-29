<template>
    <main class="form-container">
      <form @submit.prevent="handleLogin" class="form">
        <h1 class="form-title">Log In</h1>
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
        <div class="alternative-action">
          <p class="text">Not a member? </p>
          <router-link to="/signup"><button>Sign Up</button></router-link>
        </div>
        <button type="submit" class="light-purple-btn">Confirm</button>
      </form>
    </main>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const handleLogin = async () => {
  errorMsg.value = ''; // Clear previous error
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/projects');
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      errorMsg.value = 'No user found with this email.';
    } else if (err.code === 'auth/wrong-password') {
      errorMsg.value = 'Incorrect password.';
    } else if (err.code === 'auth/invalid-email') {
      errorMsg.value = 'Invalid email address.';
    } else {
      errorMsg.value = 'Failed to log in. Please try again.';
    }
  }
};
</script>

  
  <style lang="scss" scoped>
      @import "@/assets/style.scss";
  </style>