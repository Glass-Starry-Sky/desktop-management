import Store from 'electron-store'
const fs = require('fs')
// const Store = require('electron-store')

// let option = {
//     name: "config",//文件名称
//     fileExtension: "json",//文件后缀
//     //文件位置,默认情况下，它将通过遵循系统约定来选择位置,C:\Users\XSJ\AppData\Roaming\Electron\logs\Config
//     cwd: app.getPath('logs'),
//     //    encryptionKey:"aes-256-cbc" ,//对配置文件进行加密
//     clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
// }
const store = new Store();

//C:\Users\XSJ\AppData\Roaming\desktop-management\config.json

console.log(store.path)


let exists = fs.existsSync(store.path)
if (exists) {
} else {
    store.set({})
}

export default store;

// module.exports = store