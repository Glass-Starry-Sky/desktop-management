<template>
     <div class="container">
        
        <div style="display: flex;">
            <div class="document-count">全部资源：({{itemList.length}})</div>

            <div style="margin-right:15px">背景亮度:</div>
            <div class="slider-demo-block" style="width:40%;"> 
              <span class="demonstration"  ><el-slider v-model="lightNum" @change="changeLight" /></span>
              
            </div>
        </div>

        


        <div class="row">
            <!-- 大屏8个，中屏6个，小屏4个 -->
            <div class="col-lg-1-8 col-md-2 col-sm-3" v-for="(item,index) in itemList" :key="index"  
            @mousedown="curClick" @mouseenter="curEnter" @mouseleave="curLeave"
            style="height: 180px;width:180px;" :data-name="item.name" :data-uid="item.uid"
          @dblclick="changeSelectedImg(index,item.src)" ref="dblclickObj">
                <div style="position:absolute"  :class="curEnterName===item.name?'overlay':''" ></div>
                <el-space wrap  >
                   <div                 
                    :class="[curEnterName===item.name?'item-hover':'',curClickName===item.name?'item-click':'']" >
             
                        <div class="card-header" >
                        <img v-if="item.src==null||item.src==''" class="item-icon" src="@/assets/images/error.jpg" alt="加载出错" >
                        <div v-if="item.src==null||item.src==''" class="error-text">加载出错</div>
                        <img v-else class="item-icon" :src="item.src" alt="" >
                  

                          <!-- <a href="#" >{{item.path}}</a> -->
                          </div>
      
                        <div class="text" style="user-select:none">
                          {{item.name}}
                        </div>
                    <transition name="delete">
                      <div v-if="curEnterName===item.name" class="delete"  @click.stop="handleRemoveItem(item.name,item.uid)"> 
                        <Delete style="width: 1em; height: 1em; " />
                      </div>
                    </transition>

                    </div>
                  </el-space>
           
                
            </div>
        </div>  
    </div>     


</template>

<script  setup>
import { computed, onMounted, ref ,watch} from 'vue'
import setChangeStoreBackground from '@/render/setChangeStoreBackground'
import deleteImageFromMemory from '@/render/deleteImageFromMemory'
import { useStore } from 'vuex'

 const props= defineProps({
    itemList:Array
 })
const store=useStore()
// console.log(store)
let curEnterName=ref(0)
let curClickName=ref(0)

const lightNum = ref(30)

const changeLight=()=>{
  //默认最低0.1，防止完全不显示
  let opacity=(lightNum.value+10)/100
  store.commit('changeLight',opacity)
}
//监听，为了还原背景时，将值调回30
const opacity=computed(()=>store.state.forBackgroundImage.opacity)
watch(opacity,()=>{
  lightNum.value=opacity.value*100-10
})

onMounted(()=>{
  //itemList可以直接使用，相当于backgroundList

  //初始化
  if(localStorage.getItem('opacity')){
      lightNum.value=JSON.parse(localStorage.getItem('opacity')) *100-10
  }
})
// const testList=[
//     {name:'1',icon:require('@/assets/images/default.png')},
//     {name:'2',icon:require('@/assets/images/logo.png')},
//     {name:'超长的名字aaaaaa',icon:require('@/../public/anim-background4.jpg')},
//     {name:'超长的名字aaaaaa',icon:require('@/../public/anim-background4.jpg')},
//     {name:'超长的名字acccca',icon:require('@/../public/anim-background8.jpg')},
//     {name:'超长的名字bbb',icon:require('@/../public/anim-background6.jpg')},
//     {name:'超长的名字aaaaaa',icon:require('@/../public/anim-background4.jpg')},
// ]


   /**-------------------------------------------------------------
    *   双击item事件
    --------------------------------------------------------------*/
    let dblclickObj=ref(null);
    function changeSelectedImg(index,base64Data){
      console.log('双击了')

      //修改鼠标样式
      dblclickObj.value[index].style.cursor='progress'
      let _this=dblclickObj.value[index]
        //操作：修改背景图片
        store.commit('changeSelectedImg',base64Data)


       setTimeout(()=>{
        //写成这种回调的形式才不报错
         _this.style.cursor='default'
       },1900)

    }



  /**-------------------------------------------------------------
    *   删除单项
    --------------------------------------------------------------*/
    function deleteItem(uid){
      //弹出对话框
      setChangeStoreBackground((tempList)=>{
        //1.删除存储的信息
         //map遍历,修改数据      
         tempList.backgroundList.map((item,index)=>{        
                console.log(item.uid,uid)
              if(item.uid===uid){
                //修改本地数据的显示
                props.itemList.splice(index,1)
                //删除
                tempList.backgroundList.splice(index,1)

                //2.Image文件也要删除
                deleteImageFromMemory(item.name)
              }        
      
            
          })
          return tempList
      })
      
    }


const handleRemoveItem=(name,uid)=>{
        ElMessageBox.confirm(
        `您要将文件 (${name}) 删除吗？`,
        'Warning',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          deleteItem(uid)
          ElMessage({
            type: 'success',
            message: '删除完成',
          })

        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
    }



    function curEnter(e){   
      curEnterName.value=e.currentTarget.dataset.name

    }
    function curLeave(){
      curEnterName.value='null-null-null'
    }
    function curClick(e){
      curClickName.value=e.currentTarget.dataset.name
    }
</script>

<style scoped lang="less">

@item-green-normal:rgb(158, 189, 158);
@item-green-hover:rgb(157, 214, 141);
@item-green-click:rgb(126, 202, 107);
.container{
    width: 100%;
    .document-count{
      // display: inline-block;
      text-align: start;
      margin-left:25px;
      margin-right:35px;
      margin-bottom: 25px;
    }
}
.row{
    width: 100%;
    .overlay{
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(rgb(43, 38, 38), 0.3);
        z-index:5;
    }


        .text{
          padding-left:4px;
          padding-right:4px;
          width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          //超过两行显示省略号
          // display :-webkit-box ;
          //   overflow: hidden;
          //   -webkit-line-clamp :2 ; 
          //   -webkit-box-orient :   vertical ; 
          //   text-overflow: ellipsis;
        }
        .delete{
          position: absolute;
          z-index:20;
          width: 100%;
          height:30px;
          line-height: 30px;
          text-align: center;
          color: white;
          bottom: 0;
          font-size: 21px;
          // #faa,#cae

          background: linear-gradient(to right,rgb(170, 220, 255),rgb(15, 214, 158));
        }
    
}

    :deep(.el-card__body){
      padding: 0px!important;
      font-size: 14px;
      height: 40px;
      width: 200px;
      
    }
:deep(.el-card__header){
  border-bottom: 0;
  
}
.card-header{
  position: relative;
  width: 180px;
  height: 120px;
  // overflow: hidden;
  .error-text{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color:#021313;
    font-size: 14px;
  }
}

.el-card{
  --el-card-bg-color:rgba(140,100,20,0);
  --el-card-border-radius:25px;
}


.item-icon{
  
  width: 180px;
  height: 120px;
}
.item-bg{
  background-color: @item-green-normal;
}
// .item-hover{
//   background-color: @item-green-hover;
  
// }
.item-click{
  background-color: @item-green-click;
  border:1px solid rgb(125, 225, 184);
}



.delete-enter-from,.delete-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.delete-enter-to,.delete-leave-from{
  opacity: 1;
 
}
.delete-enter-active,.delete-leave-active{
  transition: all 0.5s;
}



/* 1行八等分 */
.col-xs-1-8,.col-sm-1-8,.col-md-1-8,.col-lg-1-8 {
  min-height: 1px;
//   padding-left: 15px;
//   padding-right: 15px;

  margin-left: 25px;
  margin-right: 25px;
  margin-bottom: 25px;
  position: relative;
}
 
.col-xs-1-8 {
  width: 12.5%;
  float: left;
}
 
@media (min-width: 768px) {
  .col-sm-1-8 {
    width: 12.5%;
    float: left;
  }
}
 
@media (min-width: 992px) {
  .col-md-1-8 {
    width: 12.5%;
    float: left;
  }
}
 
@media (min-width: 1200px) {
  .col-lg-1-8 {
    width: 12.5%;
    float: left;
  }
}

</style>
