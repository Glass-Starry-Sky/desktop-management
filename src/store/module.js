//vue3的vuex使用方法   
//分割成一个个模块
import { createStore } from 'vuex'


const forText = {
    // 存储数据的地方
    state: {
        count: 0
    },
    // 修改state的唯一手段
    mutations: {
        increment(state) {
            state.count++
        },
        decrement(state) {
            state.count--
        }
    },
    // 处理的方法
    actions: {
        //从context对象中直接解构出commit
        addAction({ commit }) {
            commit('increment')
        },
        decAction({ commit }) {
            commit('decrement')
        }
    },
    //相当于计算属性
    getters: {

    },
}
const forHomePage = {
    // 存储数据的地方
    state: {
        documentList: []
    },
    // 修改state的唯一手段
    mutations: {
        increment(state) {
            state.count++
        },
        decrement(state) {
            state.count--
        }
    },
    // 处理的方法
    actions: {
        //从context对象中直接解构出commit
        addAction({ commit }) {
            commit('increment')
        },
        decAction({ commit }) {
            commit('decrement')
        }
    },
    //相当于计算属性
    getters: {

    },
}
export const store = createStore({
    modules: {
        a: forText,
        b: forHomePage
    }

});