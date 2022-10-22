# desktop-management
桌面管理系统  
文件管理：目前能够创建文件夹，并拖拽桌面文件到其内保存，双击可打开  
背景管理：设置该程序的背景图片，并统一管理，（也许可以升级成桌面壁纸管理）  
数据存储的位置：C:\Users\自己的用户名\AppData\Roaming\DesktopX  
# --创建
vue create 文件名
# --添加插件
vue add electron-builder
# --下载element-plus
npm install element-plus --save
npm install -D unplugin-vue-components unplugin-auto-import
//使用element-plus中的图标
npm install @element-plus/icons-vue

# --使用yarn下载electron时
electron 可能会安装失败, 执行下列命令后, 再次执行yarn install
yarn config set ELECTRON_MIRROR https://npmmirror.com/mirrors/electron/

# --bootstrap5的使用
npm install bootstrap
npm i @popperjs/core
并且引入jquery

# --使用动态链接库dll
安装ffi-napi，ref-napi ，ref-array-napi，ref-struct-napi 依赖：
npm i ffi-napi ref-napi ref-array-napi ref-struct-napi -S




## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
npm run electron:serve
```

### Compiles and minifies for production
```
npm run build
npm run electron:build
```
