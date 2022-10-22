<!-- <template>
    <div> 
        <button @click="add">点我加1</button>
        <button @click="dec">点我减1</button>
        <div>当前值为{{count}}</div>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import {computed} from 'vue'
export default {
   setup(){

    const store = useStore()
    
    const count= computed(() => store.state.a.count)

    // console.log(store)

    return {
        store,count,
        // 使用 mutation
        increment: () => store.commit('increment'),
        // 使用 action
        add: () => store.dispatch('addAction'),
        dec: () => store.dispatch('decAction')
    }
   }

}
</script>
<style scoped> 
    
    button{
        height: 50px;
        width: 100px;
        background-color: aqua;
        margin: 10px;
    }
</style> -->
