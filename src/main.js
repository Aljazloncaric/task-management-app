import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faPlus, faSquare, faTimes, faPen, faCheck, faTableCellsLarge, faBars, faTrash, faRightFromBracket, faUserGroup, faUserPlus)

import { createPinia } from 'pinia'
const pinia = createPinia()

import mitt from 'mitt'
const emitter = mitt()

const app = createApp(App)

app.use(router)
app.use(pinia)
app.component("font-awesome-icon", FontAwesomeIcon)

app.config.globalProperties.emitter = emitter
app.mount("#app")
