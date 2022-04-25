import { createWebHistory, createRouter } from "vue-router";
import Main from "@/components/HelloWorld.vue";
import BlankBox from "@/components/BlankBox.vue";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/blank",
    name: "BlankBox",
    component: BlankBox,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
