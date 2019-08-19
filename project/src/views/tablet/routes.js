// views
import Base from "@/views/tablet/Base.vue";
import Home from "@/views/tablet/Home.vue";
import Broadcast from "@/views/tablet/Broadcast.vue";
import BroadcastSingle from "@/views/tablet/BroadcastSingle.vue";
import ListUser from "@/views/tablet/ListUser.vue";
import User from "@/views/tablet/User.vue";
import ChatList from "@/views/tablet/ChatList.vue";
import ChatSend from "@/views/tablet/ChatSend.vue";
import Quiz from "@/views/tablet/Quiz.vue";

// rotas
export default [{
  path: '/',
  component: Base,

  children: [{
      path: "/",
      name: "home",
      component: Home,
      meta: {
        main_menu: true,
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
          }
        },
        {
          path: "/inscrever-usuarios",
          name: "inscrever-usuarios",
          component: ListUser,
          meta: {
            selection_mode: true,
            main_menu: true,
          }
        }
      ]
    },
    {
      path: "/listagem-usuarios",
      name: "listagem-usuarios",
      component: ListUser,
      meta: {
        main_menu: true,
      }
    },
    {
      path: "/usuario",
      name: "usuario",
      component: User,
      meta: {
        main_menu: true,
      }
    },
    {
      path: "/chat/",
      component: ChatList,
      name: "listagem-mensagens",
      meta: {
        chat_menu: true,
        chat_list: true,
      },

      children: [{
          path: "adicionar-participante",
          name: "adicionar-participante",
          component: User,
          meta: {
            main_menu: false,
            chat_list: false,
          }
        },
        {
          path: "inscrever-participante",
          name: "inscrever-participante",
          component: ListUser,
          meta: {
            selection_mode: true,
            chat_menu: true,
            new_subscribe_mode: true,
            chat_list: false,
          }
        },
        {
          path: "selecionar-participante",
          name: "selecionar-participante",
          component: ListUser,
          meta: {
            main_menu: false,
            select_single: true,
            chat_menu: true,
            chat_list: false,
          }
        },
        {
          path: "enviar-mensagem",
          name: "enviar-mensagem",
          component: ChatSend,
          meta: {
            chat_menu: false,
            chat_list: false,
          }
        },
      ]
    },
  ]
}];