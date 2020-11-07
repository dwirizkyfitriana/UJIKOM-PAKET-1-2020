import Vue from "vue";
import VueRouter from "vue-router";

// import components
import HelloWorld from '../components/HelloWorld'

Vue.use(VueRouter);

export default new VueRouter({
    history: true,
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'Hello World',
            component: HelloWorld
        }
    ]
});