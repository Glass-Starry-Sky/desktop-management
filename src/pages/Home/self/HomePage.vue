<!-- 启动   npm run electron:serve -->

<template>
  <div class="home" >
     <div class="tip" style="user-select:none">提示：拖拽桌面文件至当前界面内(部分文件无法收容),然后双击打开 ~</div>
    <el-tabs v-model="activeName"  class="demo-tabs" style="user-select:none" @tab-click="handleClick" 
    @tab-remove="handleRemove"  tab-position="left">
       <!-- 新增 、 编辑   -->
      <div class="buttonIcon row">
         <div class="col-lg-1 col-md-2  col-sm-3">           
                <el-icon :size="20" color="#409EFC">
                 <span type="button" @click="handleAdd">
                  <DocumentAdd />
                  </span>
                </el-icon>         
        </div>
        <div class="col-lg-1 col-md-2 col-sm-3">

             <el-icon :size="20" color="#409EFC" class="no-inherit">
              <span type="button" @click="edit">
                  <Edit v-if="!isEditing"/>
                  <CircleCheck v-else />
              </span>           
             </el-icon>
        </div>
       
    
      </div>

      <div class="document-count">全部文件：({{treeNodeList[curIndex]?treeNodeList[curIndex].length:'0'}})</div>


      <!-- -------------------------------------------------------------
      *  注：这里key不要绑定id，否则修改不了位置
      -------------------------------------------------------------- -->
      <el-tab-pane v-for="(item,index) in itemTitleList" :key="index"  
      :label="item.label"  :name="item.name" 
      lazy :closable="isEditing?true:false" 
     
      >
            <!-- label插槽 -->
            <template v-slot:label >
                <!-- 双击修改名称 -->
                <div class="tab-label" @dblclick="handleDblNameEdit(item.label)" 
                :class="curIndex==index?'active-text-color':''" >
                  <el-icon :size="25" color="#409EFC"  class="Arrow leftArrow" 
                  v-if="isEditing&&curIndex==index&&index!=0">
                      <span type="button" @click="changePos('left')" 
                      ><ArrowUp /></span>
                  </el-icon>
                  {{item.label}}
                  <el-icon :size="25" color="#409EFC"  class="Arrow rightArrow" 
                  v-if="isEditing&&curIndex==index&&index!=itemTitleList.length-1">
                      <span type="button" @click="changePos('right')" 
                     ><ArrowDown /></span>
                  </el-icon>
                </div>

              
              
            </template>

            <ItemPage v-if="name===item.name" :itemTitle="itemTitleList[curIndex]" 
            @treeNodeListChange="treeNodeListChange" ></ItemPage>
      </el-tab-pane>

    </el-tabs>


  </div>
</template>

<script>
import { ref,reactive, onMounted, onBeforeMount} from 'vue'

import ItemPage from '@/pages/Home/SubHomePage/ItemPage'
import getDataString from '@/render/configRead'
import estore from '@/electron-store/estore'
import setCommonChangeStore from '@/render/setCommonChangeStore'


export default {
  name: 'HomePage',
  components: {
    ItemPage
  },
  setup(){
   
    let itemTitleList=reactive([])
    let treeNodeList=reactive([])
    //默认值
    const activeName = ref('')
    const name=ref('')
  ;
    let curIndex=ref(0)

    /**-------------------------------------------------------------
    *   监听ItemPage的treeNodeListChange事件
    --------------------------------------------------------------*/
    const treeNodeListChange=()=>{
      //重新读取
      let dataStr=getDataString()
      //先清空
      treeNodeList.splice(0)
      // console.log(treeNodeList)
      dataStr.tabs.map((item)=>{
        treeNodeList.push(item.treeNode)
      })

    }


    const handleClick = (tab, e) => {

      curIndex.value=Number(tab.index)
      // console.log('curIndex, e-->',curIndex.value,e)
      name.value=tab.props.name

      
    }

   
    //编辑功能
    let isEditing=ref(false)
    const edit=()=>{
      if(!isEditing.value){
        isEditing.value=true
        // console.log('isEditing',isEditing.value)
      }else{
        isEditing.value=false
      }
        
    }

/**----------------------------------------------------------------------------
* 基础修改config文件模板
------------------------------------------------------------------------------*/
// const setCommonChangeStore=(callback)=>{
//     let dataStr=getDataString()
//     if(dataStr.hasOwnProperty('tabs')){             
//         let tempList=callback(dataStr)  
//         // 重新存入estore
//         estore.store={
//           ...tempList
//         }
//     }
// }



/**----------------------------------------------------------------------------
* 基础对话框模板
------------------------------------------------------------------------------*/
const setCommonDialog=(tip,title,checkMessage,quitMessage,callback,validator)=>{
   ElMessageBox.prompt(tip, title, {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputPattern:
      //中文，数字，英文，下划线, 小括号
      /^[\u4E00-\u9FA5A-Za-z0-9_\(\)]+$/,
    inputErrorMessage: '输入内容不合法',
    inputValidator:(value)=>{
      //如果传入了校验函数
      if(validator){
  
        let isSame=validator(value)
        if(isSame)  return '创建的名称重复，请修改'
        return true
      }
      
    }
  })
    .then(({ value }) => {
      callback(value)
      
      ElMessage({
        type: 'success',
        message: checkMessage,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: quitMessage,
      })
    })
}
  /**------------------------------------------------------------------------------
   * 修改的文件夹名称
   ------------------------------------------------------------------------------*/
 const openNameEditDialog=(label)=>{
    function changeCallBack(value){
      //找到需要修改的文件夹名字,可以做到直接对原数组修改,value是新设置的名称
      for(let item of itemTitleList){
        if(item.label===label){
          item.label=value
          item.name=value         
        }
      }
      //对config文件里存储的数据进行修改
      setCommonChangeStore((tempList)=>{
          //map遍历,修改数据      
          tempList.tabs.map((item)=>{
            if(item.rootNode.label===label){
                item.rootNode.label=value
                item.rootNode.name=value
            }           
          })
          return tempList
        })
    }
    //校验名字是否重复
    function validator(value){        
        let isSame=false
        itemTitleList.map(item=>{       
          if(item.label===value){
            isSame=true          
          }      
        })
        return isSame;
    }
    setCommonDialog("请输入新的文件夹名称",'修改文件夹名称','修改成功','取消修改',changeCallBack,validator
 )}


  const handleDblNameEdit=(label)=>{    
      openNameEditDialog(label)
 
  }

/**------------------------------------------------------------------------------
* 创建新的文件夹
*------------------------------------------------------------------------------*/
  //如果名字占用，则在后面加上小括号和数字编号
  function changeLabel(value){
            let reg = /\((\d*)\)$/g   //匹配结尾数字
            var newX=null
            let x=null
            itemTitleList.map((item)=>{
              //名字占用
              if(item.label===value){
                //如果结尾不是'(+数字形式)'的话       
                if(item.label.match(reg)===null){
                    value=value+'(1)'
                //以该格式结尾，则得到括号中的数字
                }else{
                    // 注：执行reg.exec(item.label)会改变原值，因此不要用这种语句测试
                    let newNum =Number(reg.exec(item.label)[1]) + 1      
                    value=value.replace(reg,`(${newNum})`)
                }
                //递归，继续遍历,判断新的label有没有占用
                newX=changeLabel(value)
              }
            })
            //第一次递归,newX还不存在，返回第一次处理后的value值，之后就会返回从递归中得到的newX
            newX?x=newX:x=value
            return x
          }

    const openAddDialog = () => {
      setCommonDialog("输入您要创建的文件夹名称~",'创建文件夹','创建成功','输入取消',(value)=>{
          //进行校验，名字相同则失败
          //捕获以括号加数字结尾，如(13)
              
          value=changeLabel(value)

          itemTitleList.push({
            label:value,
            name:value
          })
        //对config文件里存储的数据进行修改
        setCommonChangeStore((tempList)=>{
            tempList.tabs.push({
                rootNode:{
				          label: value,
				          name: value
                  },
                treeNode:[] 
            })
            return tempList
        })

      })
    }
     const handleAdd=()=>{
      openAddDialog()

    }


  /**------------------------------------------------------------------------------
   * 删除文件夹
   ------------------------------------------------------------------------------*/ 
   const deleteTab=(name)=>{
          for(let index in itemTitleList){
            if(itemTitleList[index].name===name){
              //删除该项
              itemTitleList.splice(index,1)       
            }
          }
          //对config文件里存储的数据进行修改
           setCommonChangeStore((tempList)=>{
              //map遍历,修改数据      
              tempList.tabs.map((item,index)=>{
                if(item.rootNode.name===name){
                    tempList.tabs.splice(index,1)
                }           
              })
            return tempList
        })

   }
    const handleRemove=(name)=>{
     
        ElMessageBox.confirm(
        '您要将此文件夹删除吗？',
        'Warning',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          //只剩一项，不允许删除
          if(itemTitleList.length<=1){
            ElMessage({
              type: 'info',
              message: '仅剩一个文件夹，无法删除',
            })
          }
          else{
            deleteTab(name)
            ElMessage({
              type: 'success',
              message: '删除完成',
            })
          }
          
       
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })
    }

/**-----------------------------------------------------------------------------
* 修改单个tab的位置
*------------------------------------------------------------------------------*/
    const changePos=(pos)=>{
      //direction  (-1 or 1)
      function swap(list,i,direction){
        let temp=null
        temp=list[i]
        list[i]=list[i+direction]
        list[i+direction]=temp
        return list
      }
      //不能直接传递tempList.tabs，否则list的数据结构是错误的
      function swap2(list,i,direction){
        let temp=null
        temp=list.tabs[i]
        list.tabs[i]=list.tabs[i+direction]
        list.tabs[i+direction]=temp
        return list
      }
      if('left'===pos){
        itemTitleList=swap(itemTitleList,curIndex.value,-1)
        treeNodeList=swap(treeNodeList,curIndex.value,-1)
        //对config文件里存储的数据进行修改
         setCommonChangeStore((tempList)=>{
              //itemTitleList和内部的rootNode是相同的  
              tempList=swap2(tempList,curIndex.value,-1)     
                return tempList
          })
        curIndex.value--  
      }
      else if('right'===pos){
        itemTitleList=swap(itemTitleList,curIndex.value,1)
        treeNodeList=swap(treeNodeList,curIndex.value,1)

            setCommonChangeStore((tempList)=>{
              //itemTitleList和内部的rootNode是相同的  
              tempList=swap2(tempList,curIndex.value,1)
                // temp=tempList.tabs[curIndex.value]
                // tempList.tabs[curIndex.value]= tempList.tabs[curIndex.value-1]
                // tempList.tabs[curIndex.value-1]=temp       
                return tempList
            })
            //当前选项位置发生了变化，而handleClick是数据更新后才触发的，因此curIndex要主动修改
            curIndex.value++  

      }
      // //map遍历      
      // dataStr.tabs.map((item)=>{
      //        treeNodeList.push(item.treeNode)

      //     })

     
  }
/*-----------------------------------------------------------------------------------------------*/
    onBeforeMount(()=>{


      let dataStr=getDataString()

      console.log('初始的dataStr',dataStr);
        //一开始有数据,则让dragList读取数据
        if(dataStr.hasOwnProperty('tabs')){
          //map遍历      
          dataStr.tabs.map((item)=>{
             
             itemTitleList.push(item.rootNode)
             treeNodeList.push(item.treeNode)

          })
          //设置初始化的name值         
          name.value=itemTitleList[0].name
          activeName.value=itemTitleList[0].name
        //没有数据则设置默认的itemTitleList
        }else{
          let titleDefault={
            // id:"1",
            label:"default",
            name:"default"  
          }
          name.value='default'
          activeName.value='default'
          //对config文件里存储的数据进行修改          
              let tabItem={
                rootNode:{...titleDefault},
                treeNode:[]
              }
              estore.store={
                tabs:[{
                  ...tabItem
                  }                
                ]     
              }
              
  
          //itemTitleList和内部的rootNode是相同的  
          itemTitleList.push(titleDefault)
        }
        // console.log('初始的itemTitleList',itemTitleList) 
    })
    return{
      activeName,handleClick,name,curIndex,
      itemTitleList,treeNodeList,
      isEditing,edit,handleRemove,changePos,
      handleAdd,
      handleDblNameEdit,
      treeNodeListChange



    }
  }

  
}
</script>


<style scoped lang='less'>
  .home{
    .tip{
      text-align: center;
      color: #86b2f5;
    }
    .document-count{
      // display: inline-block;
      text-align: start;
      margin-left:25px;
      margin-bottom: 15px;
    }
    .tab-label{
      display: flex;
      flex-direction: column;
      align-items: center;
      height:30px;
      
    }
    .active-text-color{
      color:aqua!important;
    }
  }
.buttonIcon{

  // width: 100%;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;

}
.Arrow{
  // line-height: 0px;
  // height: 20px;
  z-index: 20;
}
.leftArrow{
  height:2px;
}
.rightArrow{
  height:2px;
}

:deep(.el-tabs__item){
  font-family: 'Merienda', cursive;
  font-size: 18px;
  color:rgb(247, 233, 233)!important;
  height:60px;
  line-height: 60px;
  margin-bottom:10px;
  width: 130px;
}
:deep(.is-icon-close){
  margin-top:-6px;
  position: absolute;
  right:2%;


}
:deep(.el-tabs__active-bar){
  background-color:rgb(125, 165, 250);
}
//滑轨
:deep(.el-tabs__nav-wrap::after){
  background-color:rgb(138, 123, 123);
}
</style>

