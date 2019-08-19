// views
import Base from "@/views/smartphone/Base.vue";
import Login from "@/views/smartphone/Login";
import Home from "@/views/smartphone/Home.vue";
import Broadcast from "@/views/smartphone/Broadcast.vue";
import BroadcastSingle from "@/views/smartphone/BroadcastSingle.vue";
import ChatList from "@/views/smartphone/ChatList.vue";
// import Quiz from "@/views/smartphone/Quiz.vue";

// rotas
export default [{
  path: '/',
  component: Base,

  children: [{
      path: "/login",
      name: "login",
      component: Login
    },

    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        main_menu: true,
        requiresAuth: true
      }
    },
    {
      path: "/transmissao",
      component: Broadcast,

      children: [{
        path: "",
        name: "transmissao",
        component: BroadcastSingle,
        meta: {
          main_menu: true,
          requiresAuth: true
        }
      }]
    },
    {
      path: "/chat/",
      component: ChatList,
      name: "listagem-mensagens",
      meta: {
        chat_menu: true,
        chat_list: true,
        requiresAuth: true
      },
    },
  ]
}];