<template>
    <div class="whole-head" ref="head" @mousedown="handleMouseDown" :draggable="false">
        <img class="head-icon" src="@/assets/images/desktopX.png" alt="" :draggable="false">
        <h3 class="title" :draggable="false" style="user-select:none">DesktopX</h3>
        
        <nav class="mynav">
            <router-link to="/"  :draggable="false" style="user-select:none">桌面管理</router-link> 
            <router-link to="/backgroundset"  :draggable="false" style="user-select:none">背景管理</router-link>
        </nav>
        <div class="right-menu">
            <el-icon @click.stop="minimize" class="minimize" type="button"><Minus /></el-icon>
            <el-icon @click.stop="maximize" class="maximize" type="button">
                <FullScreen v-if="!isFullScreen"/>
                <HelpFilled v-else/>
            </el-icon>
            <el-icon @click.stop="close" class="close" type="button"><Close /></el-icon>
           
        </div>
    </div>   
    <router-view/>     
</template>
<script>
import { ref } from '@vue/reactivity';
import { ipcRenderer,remote } from 'electron'
export default {
   setup() {
      
    // let isDown = false;  // 鼠标状态
    let baseX = 0,baseY = 0; //监听坐标
    let screenWidth=screen.width ,screenHeight=screen.height   //屏幕大小
    // console.log(screenWidth,screenHeight);
    const head=ref(null)
    let isFullScreen=ref(false)
    //使用remote获取主窗口
    const currentWindow =remote.getCurrentWindow() 



    /**-------------------------------------------------------------
    *   拖拽窗口事件
    --------------------------------------------------------------*/
    const handleMouseDown=(e)=>{
        // console.log(e)

        // isDown = true 
        baseX = e.x
        baseY = e.y
        
        // screenWidth
        let size = currentWindow.getSize()  
        //主进程中的win.setPosition(pos.posX, pos.posY, false)，会莫名导致窗口逐渐变大
        //因此此处增加最大窗口处理
        currentWindow.setMaximumSize(size[0], size[1])  //width , height
        function move(e){   

            // if(isDown){        
            const x = e.screenX - baseX   //屏幕距离-鼠标至程序左侧的距离，即程序至屏幕左侧的距离
            const y = e.screenY - baseY
            // console.log(e.screenX,e.screenY ,x,y);
            ipcRenderer.send('move-application',{
                posX:x,
                posY:y
            })
        // }
        }
        document.addEventListener('mousemove',move)
        document.addEventListener('mouseup',function(){      
            document.removeEventListener('mousemove',move)
            // isDown = false

            //还原原本resize的大小
            currentWindow.setMaximumSize(screenWidth, screenHeight)

        })
        
    }


    /**-------------------------------------------------------------
    *   菜单
    --------------------------------------------------------------*/
    const maximize=()=>{
        if(!isFullScreen.value){
            ipcRenderer.send('window-max') 
            isFullScreen.value=true
        }else{
            // currentWindow.unmaximize()
            currentWindow.setSize(1200,760)
            currentWindow.center()
            isFullScreen.value=false
        }
            
    }
    const minimize=()=>{
        ipcRenderer.send('window-min')     
    }
    const close=()=>{
        ipcRenderer.send('window-close')
    }
    
 
  
      return {
        head,handleMouseDown,
        close,minimize,maximize,isFullScreen
      }
   },
}
</script>
<style scoped lang='less'>
    .whole-head{
        display: flex;
        align-items: center;
        width: 100%;
        height: 10vh;
        background-color: rgba(rgb(3, 32, 74),0.8);
        margin-bottom: 25px;
        .head-icon{
            width: 40px;
            height: 40px;
            background-color: #bfa;
            margin-left:20px;
            margin-right:20px;
        }

        .title{
            font-family: 'font_one';
            height: 30px;
            line-height: 30px;
            color: white;
            margin:0px;
        }
        .mynav{
            padding-left:50px;
            width: 250px;
            text-align: left;
            font-size: 18px;
            // border: 1px solid #64a4e4;
        }
        .right-menu{
            flex:1;
            text-align: right;
            margin-right:20px;
            color:#e1e1e1;
            .minimize{
                font-size: 24px;
            }
            .maximize{
                margin-left:15px;
                font-size: 24px;
            }
            .close{
                font-size: 24px;
                margin-left:15px;
            }
        }
        
    }

   

</style>
