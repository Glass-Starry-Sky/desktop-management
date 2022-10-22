<template>
  
<!-- <form method="post" enctype="multipart/form-data" id="file_upload" class="file-upload">
    <input class="file-input" @change="test" ref="fileInput" 
    type="file" id="file" name="upload_image" accept="image/gif, image/jpeg, image/png, image/jpg">
     -->

    <!-- 如果使用auto-upload=true会报错 -->
    <div class="uploader-box ">
      <el-upload action="#" class="avatar-uploader"  :show-file-list="false"  
    :on-success="handlefileInput"  @change="beforeAvatarUpload" :auto-upload="false"
    >
    <!-- 使用v-show  否则imageObj一开始找不到对象 -->
        <img ref="imageObj" v-show="imageBase64"  class="img-upload" />
        <el-icon  v-show="!imageBase64" class="avatar-uploader-icon"><Plus /></el-icon>

       
        <div class="button-box" v-show="imageBase64">
          <img class="el-upload-list__item-thumbnail" :src="fileObj.url" alt="" />
          <span class="el-upload-list__item-actions">
            <!-- 预览功能 -->
            <span
              class="el-upload-list__item-preview"
              @click.stop="handlePictureCardPreview(fileObj)"
              style="font-size:20px;color:white;">
              <el-icon><zoom-in /></el-icon>
            </span>

          </span>
        </div>
 

     
      </el-upload>
      <!-- 自定义部分 -->
      <div class="info-box">
        <span class="info" ref="info">未选择文件</span>
        <span class="check" type="button" style="user-select:none;"  @click="checkUpload">确定上传</span>
        <span class="return" type="button" style="user-select:none;"  @click="returnBackground">还原背景</span>
      </div>
      <div style="display:flex;justify-content: space-around;flex-direction: column;">
        <div class="tip">提示：选择图片(仅支持JPG和PNG格式)上传，即可当做背景图片,建议使用适应电脑屏幕的图片</div>
      <div class="tip">注：背景亮度设置对默认背景无效</div>
      </div>
  
    </div>
   
 
      
      <!-- 预览功能 -->     
      <el-dialog v-model="dialogVisible" fullscreen class="dialog">
        <img  :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
<!-- </form> -->

      <ItemCard :itemList="itemList"></ItemCard>

  </template>
  
  <script  setup>
  import { onBeforeMount, onMounted, reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import ItemCard from '../ItemCard/ItemCard.vue';

  import getBackgroundString from '@/render/backgroundRead'
  import setChangeStoreBackground from '@/render/setChangeStoreBackground'
  import estoreBackground from '@/electron-store/estoreBackground'
  import saveBase64Image from '@/render/saveImageToMemory.js'
  import readResourcesImage from '@/render/readResourcesImage.js'
  import {nanoid} from 'nanoid'
  import {useStore} from 'vuex'

  const fs=require('fs')
  const pathModule =require('path')




  const imageObj=ref(null)
  const imageBase64 = ref('')
  const fileInput=ref(null)
  const info=ref(null)

  const dialogImageUrl = ref('')
  const dialogVisible = ref(false)
  const disabled = ref(false)


  let fileObj=ref({})
  let backgroundList=reactive([])
  let backgroundStr=null
  //数据格式： itemList[
  //  {uid:'',src:'base64', name:''}
  // ]
  let itemList=reactive([])
  const store=useStore()
  /**-------------------------------------------------------------
  *   还原背景
  --------------------------------------------------------------*/
  const returnBackground=()=>{
    //加载条
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      loading.close()
      store.commit('changeSelectedImg','')
      store.commit('changeLight',0.4)
      //App.vue中的watch监听到，localStorage会自动设置成''
      // localStorage.setItem('selectedImg','' )
    },500)
  }
  /**-------------------------------------------------------------
  *   确定上传
  --------------------------------------------------------------*/
  const checkUpload=()=>{
    console.log('upload')
    //加载条
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    setTimeout(() => {
      loading.close()

       //注：这种src保存不了，所以采用其他方法
       let myFile={}
        myFile.name=fileObj.value.name
        myFile.path=pathModule.resolve('.','imgResources',myFile.name)
        myFile.size=fileObj.value.size       
        myFile.type=fileObj.value.type
        myFile.uid=nanoid()    //或者使用fileObj.value.uid
        //创建文件和保存base64图片到目标地址
        saveBase64Image(imageBase64.value ,myFile.name) 


        //在estoreBackground中保存   
        //1. 有数据
        let isExist=false
        if(backgroundStr.hasOwnProperty('backgroundList')){
          // console.log('目前的myfile',myFile)
          setChangeStoreBackground((tempList)=>{
            //优先判断是否重复
            
            backgroundList.forEach((item)=>{
              if(item.name==myFile.name){
                //重复了
                ElMessage.error(('无法重复上传'))
                isExist=true
              }
            })
            //新增一条数据存储到estoreBack..
            isExist?'':tempList.backgroundList.push(myFile)           
            return tempList
            })
        }
        //2.第一次,则初始化
        else{
          estoreBackground.set('backgroundList',[{...myFile}])
          
        }
        //3.最后的处理：若没有重复，更新数据
        if(!isExist){
            backgroundStr=getBackgroundString()
            backgroundList=backgroundStr.backgroundList
            // console.log(backgroundList)
            //文件可能还没有创建好，因此延迟进行
            setTimeout(()=>{
              let fileExist = fs.existsSync(pathModule.resolve('.', 'imgResources',myFile.path));
              // console.log('fileExist',fileExist);
              if(fileExist){
                setItemList()
              //如果不存在，1秒后再次尝试一次
              }else{
                setTimeout(()=>{
                  try {
                    setItemList()
                  } catch (error) {
                      ElMessage.error('上传失败')
                  } 
                 
                },1000)
              }
              
            },500)
        }

    }, 500)     
  }
  
  /**-------------------------------------------------------------
  *   图片预览
  --------------------------------------------------------------*/
  const handlePictureCardPreview = () => {
   
    // console.log(fileObj.value)
    dialogImageUrl.value = fileObj.value.src
    dialogVisible.value = true
  }


  /**-------------------------------------------------------------
  *   删除某一项,没有使用 2022/10/5
  --------------------------------------------------------------*/
    const handleRemove = (file) => {
        console.log(file)
    }




  const handlefileInput=(rawFile)=>{
    // 清除背景图片:
    imageBase64.value= null;
				if (!rawFile) {
					info.value.innerHTML = '没有选择文件';
					return;
				}
				let file = rawFile.raw;   
        //存储信息
        fileObj.value=file
        info.value.innerText= fileObj.value.name
        

				//读取文件:
				let reader = new FileReader();
				reader.onload = function(e) {        
            let data = e.target.result;
            fileObj.value.src=data
            imageBase64.value = data
            imageObj.value.src=data
				};
				// 以DataURL的形式读取文件:    
				reader.readAsDataURL(file);             
        
  }

  /**-------------------------------------------------------------
  *   检测上传的图片格式
  --------------------------------------------------------------*/
  const beforeAvatarUpload = (rawFile) => {
    // console.log(rawFile)
    if (rawFile.raw.type !== 'image/jpeg'&&rawFile.raw.type !== 'image/png') {
      ElMessage.error('仅接受JPG和PNG格式!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('不可超过2MB!')
      return false
    }

    handlefileInput(rawFile)
  }



  /**-------------------------------------------------------------
  *   读取base64格式,得到最终的itemList数据传给ItemCard
  --------------------------------------------------------------*/
  function setItemList(){
    //先清空
    itemList.splice(0)
    backgroundList.forEach((item,index)=>{
      let obj={uid:'',src:'',name:''}

      obj.src=readResourcesImage(item)
      obj.uid=backgroundList[index].uid
      obj.name=backgroundList[index].name
      //itemList之后交给ItemCard渲染
      itemList.push(obj)
    
    })
    console.log('itemList',itemList)
  }

  /**-------------------------------------------------------------
  *   初始化
  --------------------------------------------------------------*/
  onMounted(()=>{
    //如果backgroundList有数据，把数据全部读取出来
    setItemList()

  })
  onBeforeMount(()=>{

    backgroundStr=getBackgroundString()

      console.log('初始的backgroundStr',backgroundStr);
        //一开始有数据,则让dragList读取数据
        if(backgroundStr.hasOwnProperty('backgroundList')){
          //map遍历      
          backgroundStr.backgroundList.map((item)=>{           
              backgroundList.push(item)
          })
        //没有数据则设置默认
        }else{

        }

  })


  </script>
  
  <style scoped lang="less">

    .uploader-box {
      display: flex;
      margin: 20px;
      margin-left:90px;
    width: 1000px!important;
    height: 150px;
    //图片旁的信息
    .info-box{
      display: flex;
      margin-left:20px;
      flex-direction: column;
      justify-content: space-around;

      .check{
        border: 1px solid #fffff1;
        border-radius: 10px;
        background-color: #55aaee;

        &:hover{
          color:#1e2021;
          background-color:#0e6ec2;
        }
      }
      .return{
        border: 1px solid #f9f0f0;
        border-radius: 10px;
        background-color: #39434c;
        &:hover{
          color:#b9c3c8;
          background-color:#222527;
        }
      }
    }
    .tip{
      width: 465px;
      margin-left:25px;
      // align-self: center;
      color: #86b2f5;
    }
    .button-box{
      display: flex;
      position: absolute;
      width: 100%;
      height: 100%;
      text-align: center;
      opacity: 0;
      &:hover{
        opacity: 1;
      }
      // 预览部分
      .el-upload-list__item-actions{
        display: flex;
        height: 100%;
        width: 100%;
      }
      .el-upload-list__item-preview{
        margin: auto auto;
        &:hover{
          color: #86b2f5!important;
        }
      } 

    }
  }

  </style>
  
  <style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  
  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }
  
  .el-icon.avatar-uploader-icon,.img-upload{
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: left;
  

  }

input{
    background-color: transparent !important;
    color: #8c939d;
}
  .file-input{
    border: none;
    background-color: transparent;
    color: #8c939d;
  }
  
  .el-dialog{
    background:rgba(19, 18, 18, 0.7)!important;
    .el-dialog__close{
      // background: rgb(248, 243, 243);
      color:rgb(94, 224, 239);
      font-size: 20px;
    }
  }

  </style>