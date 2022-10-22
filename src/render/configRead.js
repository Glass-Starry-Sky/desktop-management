//读取存储在本地的config文件
const fs = require('fs')

import estore from '../electron-store/estore'

// const estore = require('../electron-store/estore')

//C:\\Users\\XSJ\\AppData\\Roaming\\desktop-management\\config.json
//C:\\Users\\XSJ\\AppData\\Roaming\\Electron\\config.json  (old)

//注意：一定要使用同步，否则不能用return和等号接收数据



const getDataString = () => {

    var dataString = fs.readFileSync(estore.path, 'utf8', function (err, dataStr) {
        // 打印失败的结果
        // 如果读取成功，则err的值为null；如果读取失败，则err的值为错误对象，dataStr的值为undefined
        if (err) {
            return console.log('读取文件失败！' + err.message)
        }

        // console.log('-------------------------')
        // 打印成功的结果
        dataStr = JSON.parse(dataStr)
        return dataStr

    })
    //不知道为什么return出去就变成字符串了，又要JSON解析一遍
    // console.log('dataString', JSON.parse(dataString))
    return dataString = JSON.parse(dataString)
}

export default getDataString;