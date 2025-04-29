<template>
  <main class="form-container">
    <form @submit.prevent="handleSignup" class="form">
      <h1 class="form-title">Sign Up</h1>
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <ErrorMessage :errorMsg="errorMsg" v-if="errorMsg" />
      <div class="alternative-action">
          <p class="text">Already a member? </p>
          <router-link to="/login"><button>Log In</button></router-link>
        </div>
      <button type="submit" class="light-purple-btn">Sign Up</button>
    </form>
  </main>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase'; // Make sure db is exported from your firebase.js
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';

const email = ref('');
const password = ref('');
const errorMsg = ref('');
const router = useRouter();

const handleSignup = async () => {
  errorMsg.value = ''; // Clear previous error
  try {
    // 1. Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    
    // 2. Save user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      uid: user.uid,
    });
    
    // 3. Redirect after successful save
    router.push('/projects');
  } catch (err) {
    handleSignupError(err);
  }
};

const handleSignupError = (err) => {
  if (err.code === 'auth/email-already-in-use') {
    errorMsg.value = 'This email is already in use.';
  } else if (err.code === 'auth/invalid-email') {
    errorMsg.value = 'Invalid email address.';
  } else if (err.code === 'auth/weak-password') {
    errorMsg.value = 'Password should be at least 6 characters.';
  } else {
    errorMsg.value = 'Something went wrong. Please try again.';
    console.error('Signup error:', err);
  }
};
</script>

  
  <style lang="scss" scoped>
  @import "@/assets/style.scss";
</style>