import {
	createSSRApp
} from "vue";
import App from "./App.vue";
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'


export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia()
	pinia.use(createPersistedState())
	app.use(pinia)


	return {
		app,
	};
}
