<template>
  <main class="modal-container" @click="closeModal($event)">
    <div class="modal-window" style="height: 50vh;">
      
      <div class="modal-upper-row">
        <h1 class="modal-title">Members</h1>
        <button class="close-btn" type="button" @click="emit('onclosemodal')">
          <font-awesome-icon icon="fa fa-times" />
        </button>
      </div>

      <div class="toggle-window-container" v-if="allowAddingMembers">
        <button class="member-viewer-btn" style="margin-right: 1rem;" :class="{'active-option': activeOption === 'team'} " @click="toggleOptions('team')"><font-awesome-icon icon="fa-solid fa-user-group" /> Team</button>
        <button class="member-viewer-btn" :class="{'active-option': activeOption === 'add-members'}" @click="toggleOptions('add-members')"><font-awesome-icon icon="fa-solid fa-user-plus" /> Add Members</button>
      </div>

      <div class="member-list" v-if="activeOption === 'team'">
        <div class="member">
          <h2>{{ owner.email }}</h2>
          <div class="badge badge-owner">Admin</div>
        </div>
        <div v-for="member in members" :key="member.UID" class="member">
          <h2>{{ member.email }}</h2>
          <div class="badge badge-member">Member</div>
        </div>
      </div>

      <div class="add-members-container" v-if="activeOption === 'add-members'">
        <input
          type="text"
          placeholder="Search by email"
          class="board-name-input"
          style="margin-bottom: 20px; width: 100%;"
          @input="fetchMatchingUsers"
        />

        <div v-if="userSearchResultSet.length > 0">
            <div v-for="user in userSearchResultSet" :key="user.UID" class="member">
              <h2>{{ user.email }}</h2>
              <button @click="addUserToProject(projectData.id, user.UID)"> <font-awesome-icon icon="fa-solid fa-user-plus" /> Add</button>
            </div>
        </div>
        <div class="zero-results-placeholder" v-else>
          No Matching Users
        </div>

      </div>

    </div>
  </main>
</template>


<script setup>

import { defineEmits, defineProps, onMounted, ref } from 'vue'
import { getUsersByIds } from '@/composables/useUsers';
import { getOwnerById } from '@/composables/useUsers';
import { searchUsersByEmail} from '@/composables/useUsers';
import { addNewMember } from '@/composables/useProjects';
import { getProjectByID } from '@/composables/useProjects';

// Emit event to close modal window
const emit = defineEmits(['onclosemodal'])
const closeModal = (event) => {
if (event.target === event.currentTarget) {
    emit('onclosemodal');
  }
}

// Allow adding members if user === admin or project === "solo"
const props = defineProps(["userRole", "projectId"]);
const allowAddingMembers = ref(true)

onMounted(async() => {
if(props.userRole === "Guest"){
    allowAddingMembers.value = false
  }
  toggleOptions("team")

  await fetchProjectData()
  fetchProjectMembers()

  // Team members list is visible first
})

let projectData = ref({})
const fetchProjectData = async () =>{
  projectData.value = await getProjectByID(props.projectId)
}


const activeOption = ref()
const toggleOptions = async (option) =>{
activeOption.value = option
if(option === "add-members"){
  userSearchQuery.value = ""
  userSearchResultSet.value = []
} 
}

// FETCH CURRENT MEMBERS

let members = ref([]);
let owner = ref({ email: "", UID: "" });
const fetchProjectMembers = async () => {
  const ownerData = await getOwnerById(projectData.value.ownerId);
  owner.value = ownerData[0] || { email: "", UID: "" };
  members.value = await getUsersByIds(projectData.value.memberIDs);
};


// SEARCH FOR NEW MEMBERS

let userSearchResultSet = ref([]);
let userSearchQuery = ref("");
const fetchMatchingUsers = async (event) => {
  userSearchQuery.value = event.target.value;

if (userSearchQuery.value.length < 2) {
  userSearchResultSet.value = [];
  return;
}

try {
  // Get all matching users
  const allMatches = await searchUsersByEmail(userSearchQuery.value);
  
  // Filter out existing members and owner
  userSearchResultSet.value = allMatches.filter(user => 
    !members.value.some(member => member.UID === user.UID) &&
    user.UID !== owner.value.UID
  );
  
  console.log("Filtered search results:", userSearchResultSet.value);
} catch (error) {
  console.error("Search failed:", error);
  userSearchResultSet.value = [];
}
};


// ADD NEW USER

const addUserToProject = async (projectId, userUID) => {
try {
  console.log(userUID)
  await addNewMember(projectId, userUID);

  // 
  await fetchProjectData()
  fetchProjectMembers()

} catch (error) {
  alert(`Failed to add member: ${error.message}`);
}
}
</script>

<style lang="scss" scoped>
  @import "@/assets/style.scss";
  .active-option{
    background-color: $light;
  }
  .toggle-window-container{
    margin-bottom: 2rem;
  }
  .member{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
    h2{
      color: white;
      font-size: 1rem;
      font-weight: normal;
    }
    .badge{
      color: $white;
    }
  }
  .zero-results-placeholder{
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $white;
  }
</style>