<template>
  <!-- <img class="norm-min-width-ima xs-min-width-ima" src="./anim-background6.jpg" alt="" ></img> -->
 
  <div class="background" :draggable="false" >
    <img ref="backImgObj" class="norm-min-width-ima xs-min-width-ima" :src="selectedImg.src" alt="" >
    <Head></Head>
   
  </div>
</template>
<script>
import Head from '@/components/Head.vue'
import  { useStore } from 'vuex'
import { computed,watch,ref, toRaw,reactive,shallowRef, onMounted} from '@vue/runtime-core'


  export default {
    components:{
      Head
    },
    setup(){
      const store=useStore()
      let selectedImgForWatch=computed(()=>store.state.forBackgroundImage.selectedImg)
      let selectedImg=ref({})
      
      let backImgObj=ref(null)

      /**-------------------------------------------------------------
      *   亮度
      --------------------------------------------------------------*/
      const opacity=computed(()=>store.state.forBackgroundImage.opacity)
      watch(opacity,(newVal,oldVal)=>{
        backImgObj.value.style.opacity=opacity.value
        localStorage.setItem('opacity',JSON.stringify(opacity.value) )
      })
      onMounted(()=>{
        //初始化,如果之前设置了背景图，就读取处理
        if(localStorage.getItem('selectedImg')){
          //采用这种方式，还原背景时，才能正确监听，因为这种方式第一次的selectedImgForWatch被修改过
          store.commit('changeSelectedImg',JSON.parse(localStorage.getItem('selectedImg')).src)

        }
        if(localStorage.getItem('opacity')){
          backImgObj.value.style.opacity=JSON.parse(localStorage.getItem('opacity')) 
        }
        
      })

      watch(selectedImgForWatch.value,(newVal,oldVal)=>{
        //暂时放弃响应式，防止提前修改背景图
        selectedImg.value=toRaw(selectedImg) 
        const loading = ElLoading.service({
            lock: true,
            text: 'Loading',
            background: 'rgba(0, 0, 0, 0.7)',
      })
          setTimeout(() => {
            loading.close()
            setTimeout(()=>{
              selectedImg.value=selectedImgForWatch.value
              //可以存到localStorage 
              localStorage.setItem('selectedImg',JSON.stringify(selectedImg.value) )
             
            },500)

          },500)
          
      })
      return {
        selectedImg,backImgObj
      }
    }
    
  }
</script>
<style lang="less">

/* 媒体查询  自适应  */
@media (min-width: 450px) {
  .norm-min-width-ima{
    position:fixed;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    opacity: 0.3;
    transform: translateX(0%);
    // transform: translateX(0px)!important;
    transition: all 1s;
  }
   
}

@media (max-width: 450px) {
  .xs-min-width-ima{
    position:fixed;
    height: 100%;
    /* width: 100%; */
    z-index: -1;
    opacity: 0.3;
    transform: translateX(-30%);
    transition: all 1s;
  }
}


#app {

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fcfcfc;
}

nav {


  a {
    width: 70px;
    padding:10px;
    font-weight: bold;
    color: #64a4e4;
    font-family:'Courier New', Courier, monospace;
    text-decoration: none;
    &.router-link-exact-active {
      color: #00ffff;
      text-decoration:underline;
      
    }
  }
}

.background{
  position: relative;
  height: 100vh;
  width: 100vw;

}

//全局字体设置
@font-face {
            font-family: 'font_one';
            src: url(@/assets/fontfamily/ModernAntiqua-Regular.ttf);
    }
</style>
