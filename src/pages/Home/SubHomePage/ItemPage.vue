<template>
 
    <div class="container">
        
        <div class="row">
            <div class="col-lg-1-8 col-md-2 col-sm-3" v-for="(item,index) in dragList" :key="index"  
            @mouseenter="mouseEnter">
             
                <el-space wrap  >
                   <div :data-path="item.path" :data-name="item.name" :data-index="index"
                   @dblclick="openProcedure" ref="dblclickObj">
                      <el-card  class="box-card item-bg" style="width: 100px"
                      @mouseenter="curEnter" @mouseleave="curLeave" @mousedown="curClick"
                      :data-name="item.name" 
                    :class="[curEnterName===item.name?'item-hover':'',curClickName===item.name?'item-click':'']" 
                      >
                      <template #header>
                          <div class="card-header" >
                          <img v-if="item.icon==null||item.icon==''" class="item-icon" src="@/assets/images/default.png" alt="" >
                          <img v-else class="item-icon" src="@/assets/images/document.jpeg" alt="" >
                  
                          <span style="user-select:none"></span>
                          <!-- <a href="#" >{{item.path}}</a> -->
                          </div>
                      </template>
                      <div class="text item" style="user-select:none">
                        {{item.name}}
                      </div>
                    <transition name="delete">
                      <div  v-if="curEnterName==item.name" class="delete"  @click.stop="handleRemoveItem(item.name)"> 
                        <Delete style="width: 1em; height: 1em; " />
                      </div>
                    </transition>
                      
                      </el-card>
                    </div>
                  </el-space>
           
                
            </div>
        </div>  
    </div>     
</template>
<script>

import { ref , reactive, onMounted,onUnmounted} from 'vue'
// const open =require('@/utils/open')
import openExec from '@/utils/open'
//????????????dll?????????
// import '@/utils/useMyDll3'
// import useDllGetIcon from '@/utils/useMyDllGetIcon'


//??????electron-store
import estore from '@/electron-store/estore'
import getDataString from '@/render/configRead'
import setCommonChangeStore from '@/render/setCommonChangeStore'

export default {
    props: {
        itemTitle:Object,
    },
    emits:['treeNodeListChange'],
   setup(props,{emit}) {
    
    let dragList=reactive([])    //treeNode
    const rootNode =reactive(props.itemTitle) 

    /**-------------------------------------------------------------
    *   ??????item??????
    --------------------------------------------------------------*/
    let dblclickObj=ref(null);
    function openProcedure(e){
      //???????????????????????????
      let {index}=e.currentTarget.dataset

      dblclickObj.value[index].style.cursor='progress'
      let _this=dblclickObj.value[index]
       //?????????????????????
       openExec(e.currentTarget.dataset.path)
       setTimeout(()=>{
        //???????????????????????????????????????
         _this.style.cursor='default'
       },1900)

    }

    //??????item??????????????????,??????????????????item??????????????????

    let curEnterName=ref(0)
    let curClickName=ref(0)
    function curEnter(e){   
      curEnterName.value=e.target.dataset.name

    }
    function curLeave(){
      curEnterName.value='null-null-null'
    }
    function curClick(e){
      curClickName.value=e.currentTarget.dataset.name
    }

    /**-------------------------------------------------------------
    *   ????????????
    --------------------------------------------------------------*/
    function deleteItem(name){
      //???????????????
      setCommonChangeStore((tempList)=>{
        
         //map??????,????????????      
         tempList.tabs.map((item,index)=>{        
            item.treeNode.forEach((node,i)=>{       
              if(node.name===name){
                //???????????????????????????
                dragList.splice(i,1)
                //??????
                tempList.tabs[index].treeNode.splice(i,1)
              }        
            })
            
          })
          return tempList
      })
    }


    const handleRemoveItem=(name)=>{
        ElMessageBox.confirm(
        `??????????????? (${name}) ????????????`,
        'Warning',
        {
          confirmButtonText: '???',
          cancelButtonText: '???',
          type: 'warning',
        }
      )
        .then(() => {
          deleteItem(name)
          ElMessage({
            type: 'success',
            message: '????????????',
          })
          emit('treeNodeListChange')
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '????????????',
          })
        })
    }


    const  mouseEnter=(e)=>{
      // console.log('en',e);

    }
   

    /**-------------------------------------------------------------
    *   ????????????
    --------------------------------------------------------------*/
    //??????id???????????????????????????????????????????????????    2022/8/26
    var curId = 0 
   
    const myDrop= (e) => {
            e.preventDefault()
            e.stopPropagation()
   

            let name = ''
            let path = ''
            let id = ''
            let icon=''
            //????????????????????????
      // console.log(e)
            if(e.dataTransfer.files.length==0){
                  ElMessage({
                    message: '??????:??????????????????????????????',
                    type: 'warning',
                  })
            }
            else{
                Array.from(e.dataTransfer.files).forEach((f) => {
                  // console.log('File(s) you dragged here: ', f.name, f.path)

                //???????????????,?????????????????????.ink
                let reg=/(\.lnk)$/i
                let isLnk=reg.test(f.name)
                if(isLnk){
                  name=f.name.replace(reg,'')
                  }
                else{
                    name = f.name
                }
                //??????????????? ????????????
                let newReg=/\.[\s\S]*$/i
                // let x=newReg.test(f.path)         // let x=f.path.match(reg)
                // console.log(f.path,x);
                
                newReg.test(f.path)? '':icon=require('@/assets/images/document.jpeg')


                  //??????????????????
                  let isHasThisItem=dragList.filter((item)=>item.name===name)
                  if(isHasThisItem.length>0){
                    //??????????????????????????????return??????????????????????????????????????????????????????????????????
                    ElMessage({
                    message: '??????:??????????????????????????????',
                    type: 'warning',
                    })
                    return ;
                  }
        

                  path = f.path
                  id = (++curId) + ""
                  let obj = { id, name, path ,icon}
                  dragList.push(obj)

              })
              console.log('dragList',dragList)

              //???????????????????????????
              let tabItem={
                rootNode:{...rootNode},
                treeNode:[...dragList]
              }
              //??????config.json???????????????????????????????????????????????????????????????????????????????????????
            let dataString=getDataString()
              // console.log('----',dataString)
              // ????????????

              if(dataString.hasOwnProperty('tabs')){

                // console.log('???????????????');  
                  //????????????store
                  let saveAll = estore.store
                  //???store?????????tabs???????????????????????????
                  let temp = estore.store.tabs
                  //???Index??????????????????????????????????????????
                  let index=null
                  for (let k in dataString.tabs) {
                    if (dataString.tabs[k].rootNode.label ===rootNode.label) {
                        index=k
                        break
                    }
                  }
                  temp.splice(index,1,tabItem)
                  //???????????????tabs??????
                  saveAll.tabs = temp
                  //????????????store
                  estore.store = {
                      ...saveAll,
                  }
                  emit('treeNodeListChange')
              }else{
                // console.log('????????????????????????');
                estore.store={
                  tabs:[{
                  ...tabItem
                  }                
                  ]                
                }
                emit('treeNodeListChange')
              }
            }
           
  
        }

        const myDragOver=(e) => {
            e.preventDefault();
            e.stopPropagation();
        }
    onMounted(()=>{     
        document.addEventListener('drop', myDrop)   
        document.addEventListener('dragover',myDragOver );

        let dataStr=getDataString()
        //??????????????????,??????dragList????????????
        if(dataStr.hasOwnProperty('tabs')){
          //?????????  
          let tabItem=dataStr.tabs.filter((item)=>item.rootNode.label===rootNode.label)
          // console.log('??????????????????',rootNode);
          if(tabItem.length>0){         
            for(let item of tabItem[0].treeNode){
                dragList.push(item)
            }
          }

          
        }

  
})
      onUnmounted(()=>{
        document.removeEventListener('drop',myDrop )
        document.removeEventListener('dragover',myDragOver )
      })

        return {
            dragList,
            openProcedure,dblclickObj,
            curEnterName,curClickName,curEnter,curLeave,curClick,
            rootNode,
            deleteItem,handleRemoveItem
        }
   },
}
</script>
<style scoped lang='less'>
@item-green-normal:rgb(158, 189, 158);
@item-green-hover:rgb(157, 214, 141);
@item-green-click:rgb(153, 243, 131);

    .box-card{
        position: relative;
        margin-bottom: 15px;
        padding-bottom: 9px;
        overflow: hidden;
        .text{
          padding-left:4px;
          padding-right:4px;
          //???????????????????????????
          display :-webkit-box ;
            overflow: hidden;
            -webkit-line-clamp :2 ; 
            -webkit-box-orient :   vertical ; 
            text-overflow: ellipsis;
        }
        .delete{
          position: absolute;
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
      
    }
:deep(.el-card__header){
  border-bottom: 0;
}
.el-card{
  --el-card-bg-color:rgba(140,100,20,0);
  --el-card-border-radius:25px;
}

.item-icon{
  height: 43px;
  width: 40px;
  
}
.item-bg{
  background-color: @item-green-normal;
}
.item-hover{
  background-color: @item-green-hover;

  
}
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




//1????????????
.col-xs-1-8,.col-sm-1-8,.col-md-1-8,.col-lg-1-8 {
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
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
