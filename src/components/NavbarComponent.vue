<template>
  <nav>
    <div class="navbar-container">
      
      <div class="project-metadata" v-if="tasksViewActive">

        <h1 v-if="!editProjectMode" style="margin-right: 1rem;">{{ projectName }}</h1>

        <div class="edit-project-mode" v-if="editProjectMode">
          <input type="text" v-model="projectName" style="margin-right: 1rem;">
          <button @click="confirmChanges" style="margin-right: 1rem;"><font-awesome-icon icon="fa-solid fa-check" /></button>
          <button @click="cancelChanges"><font-awesome-icon icon="fa-solid fa-xmark" /></button>
        </div>

        <div class="circle" v-if="!editProjectMode"></div>
        <h2 class="project-type" v-if="!editProjectMode">{{ projectType }}</h2>
        <div class="circle" v-if="userRole !== null && !editProjectMode"></div>
        <h2 class="user-role" v-if="userRole !== null && !editProjectMode">{{ userRole }}</h2>

      </div>

      <h1 v-else>Projects</h1>
      
      <div class="project-options">

        <button class="members-btn" v-if="!editProjectMode" @click="toggleMemberViewerModal" style="margin-right: 1rem;"><font-awesome-icon icon="fa-solid fa-user-group" /></button>

        <button class="edit-btn" v-if="!editProjectMode" @click="handleEditProjectMode" style="margin-right: 1rem;"><font-awesome-icon icon="fa-solid fa-pen" /></button>

        <button class="delete-btn" v-if="!editProjectMode" @click="toggleDeleteProjectsModal" style="margin-right: 1rem;"><font-awesome-icon icon="fa-solid fa-trash" /></button>

        <button @click="handleLogout" v-if="!editProjectMode">
          <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
        </button>

      </div>

      <DeleteProject @onclosemodal="toggleDeleteProjectsModal" v-if="deleteProjectsModalVisible" />

      <MemberViewer @onclosemodal="toggleMemberViewerModal" v-if="memberViewerModalVisible" :userRole="userRole" :projectId="projectData.id" />

    </div>  
  </nav>

</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useRouter } from 'vue-router';
import { defineProps, ref, watch } from "vue"
import { updateProjectName } from '@/composables/useProjects';
import { getProjectByID } from '@/composables/useProjects';
import { determineUserRole } from '@/composables/useProjects';
import { determineProjectType } from '@/composables/useProjects';

import DeleteProject from "@/components/Modals/DeleteProject.vue"
import MemberViewer from './Modals/MemberViewer.vue';

const router = useRouter();

const props = defineProps({
  tasksViewActive: Boolean,
  projectId: String
});

// MANAGING MODAL WINDOW FOR DELETING PROJECTS

let deleteProjectsModalVisible = ref(false)
const toggleDeleteProjectsModal = () =>{
  deleteProjectsModalVisible.value = !deleteProjectsModalVisible.value
}

// MANAGING MODAL WINDOW FOR MEMBERS

let memberViewerModalVisible = ref(false)
const toggleMemberViewerModal = () =>{
  memberViewerModalVisible.value = !memberViewerModalVisible.value
}

// CHANGING PROJECT NAME

const editProjectMode = ref(false)
const handleEditProjectMode = () =>{
  editProjectMode.value = !editProjectMode.value
}

const confirmChanges = () =>{
  console.log("Saving changes to firebase")
  updateProjectName(props.projectId, projectName.value)
  projectNameCopy.value = projectName.value
  handleEditProjectMode()
}

const cancelChanges = () =>{
  projectName.value = projectNameCopy.value
  handleEditProjectMode()
}

const projectData = ref(null);
const projectName = ref("");
const projectNameCopy = ref("");
let projectType = ref("")
let userRole = ref("")

watch(() => props.projectId, async (newId) => {
  if (newId) {
    console.log("Fetching data for project:", newId);
    projectData.value = await getProjectByID(newId);
    console.log("Project data:", projectData.value);
    
    // Update name references
    if (projectData.value?.name) {
      projectName.value = projectData.value.name;
      projectNameCopy.value = projectData.value.name;
    }

    projectType.value = determineProjectType(projectData.value.ownerId, projectData.value.memberIDs)
    console.log(projectType.value)

    userRole.value = determineUserRole(projectData.value.ownerId, projectData.value.memberIDs)
    console.log(projectType.value)

  }
}, { immediate: true });


const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};
</script>

<style lang="scss" scoped>
nav {
  @import "../assets/style.scss";
  width: 100%;
  height: 10vh;
  background-color: $dark;
  @include flex-row();
  justify-content: flex-end;
  align-items: center;
}

.navbar-container {
  width: 1000px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.project-options, .project-metadata {
  display: flex;
  flex-direction: row;
}
.project-metadata{
  align-items: center;
}

.project-type, .user-role{
  color: white;
  font-size: 1rem;
  font-weight: normal;
  margin-right: 1rem;
}
.circle{
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  background-color: white;
  margin-right: 0.4rem;
}

h1 {
  color: white;
}
</style>
