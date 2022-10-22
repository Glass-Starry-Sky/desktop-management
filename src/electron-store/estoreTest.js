//npm install electron-store


//测试方式：  electron .\src\electron-store\estoreTest.js
//注：一定要  electron .\src\electron-store\estoreTest.js  的方式启动，否则找不到app

const Store = require('electron-store');
// const path = require('path')

const electron = require('electron')
const app = electron.app

console.log('111', app.getPath('userData'))


let option = {
    name: "config",//文件名称,默认 config
    fileExtension: "json",//文件后缀,默认json
    //文件位置,默认情况下，它将通过遵循系统约定来选择位置,C:\Users\XSJ\AppData\Roaming\electron-store-nodejs\Config
    cwd: app.getPath('logs'),
    // cwd: path.join(__dirname, './storage'),    //当前目录的方案

    //    encryptionKey:"aes-256-cbc" ,//对配置文件进行加密
    clearInvalidConfig: true, // 发生 SyntaxError  则清空配置,
}
const store = new Store(option);


/**-------------------------------------------------------------
*   各种存储方法
--------------------------------------------------------------*/
console.log(store.path); //=> {bar: true}
store.set('unicorn', '这是需要存储的内容');
console.log(store.get('unicorn')); //=> '这是需要存储的内容'

// 使用点表示法 访问嵌套属性
store.set('foo.bar', true);
store.set('foo.aaa', true);
store.set('foo.bar', false);
console.log(store.get('foo')); //=> {bar: true}

// 嵌套存储
store.set({
    one: {
        two: {
            three: 'hahaha'
        }
    }
});
store.set({
    name: 'test1',
    one: {
        two: {
            three: 'hahaha'
        }
    }
});

// var rootNode1 = {
//     index: 0,
//     name: 'default1'
// }
// var rootNode2 = {
//     index: 1,
//     name: 'default2'
// }
// var list = [
//     {
//         name: 'test1',
//     },
//     {
//         name: 'test2',
//     },
//     {
//         name: 'test3',
//     },
// ]

// var treeNode = {
//     "rootNode": {
//         "index": 2,
//         "name": "default3"
//     },
//     "nameList": [
//         {
//             "name": "new1"
//         },
//         {
//             "name": "new2"
//         },
//         {
//             "name": "new3"
//         }
//     ]
// }
// store.store = {
//     tabs: [
//         {
//             "rootNode": rootNode1,
//             "nameList": list
//         },
//         {
//             "rootNode": rootNode2,
//             "nameList": list
//         }
//     ]
// }

// //保存整个store
// saveAll = store.store
// //从store里取出tabs数组，单独增加数据
// temp = store.store.tabs
// temp.push(treeNode)
// //替换原来的tabs数组
// saveAll.tabs = temp
// //重新存入store
// store.store = {
//     ...saveAll,

// }

// console.log('temp!!!', temp)

// store.set(
//     'tabs[0].nameList', [{
//         name: '修改后',
//     },]
// )

// store.store.tabs.push('xxxxx')
// console.log(typeof (store.store.tabs))
// console.log('store.store', store.store.tabs)
// console.log(store.get('one.two.three'));

store.delete('unicorn');
console.log(store.get('unicorn'));  //=> undefined