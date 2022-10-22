
//一定要使用window.require才行
var { exec } = window.require('child_process')

//执行某个文件
export default function (path) {
    exec(`start "" "${path}" `), function (err, stdout, stderr) {
        console.log('ok')
        if (err) {
            throw err;
        }
    }
}


//测试
// exec('start "" "C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe"'), function (err, stdout, stderr) {
//     console.log('ok')
//     if (err) {
//         throw err;
//     }
// }