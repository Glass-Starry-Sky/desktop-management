//vue3的vuex使用方法   
//使用此文件  2022/10/3
import { createStore } from 'vuex'


const forBackgroundImage = {
    // 存储数据的地方
    state: {
        selectedImg: {
            src: '',
        },
        opacity: ''
    },
    // 修改state的唯一手段
    mutations: {
        // increment(state) {
        //     state.count++
        // },
        changeSelectedImg(state, base64Data) {
            state.selectedImg.src = base64Data
        },
        changeLight(state, opacity) {
            state.opacity = opacity
        }

    },
    // 处理的方法
    actions: {
        //从context对象中直接解构出commit
        // addAction({ commit }) {
        //     commit('increment')
        // },

    },
    //相当于计算属性
    getters: {

    },
}

export const store = createStore({
    modules: {
        forBackgroundImage

    }

});