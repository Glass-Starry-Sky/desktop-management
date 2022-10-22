//useMyDllGetIcon.js

//目前状况，能获得目标的句柄值，但是这貌似是在进程中使用的，在这里无法使用。因此图标的问题还需研究
//                2022/8/28

const ffi = window.require('ffi-napi')   //在javascript中调用动态链接库
var ref = window.require('ref-napi')     //这个模块定义了很多C/C++的常见数据类型
var ArrayType = window.require('ref-array-napi')   //提供了一个数组的实现,在声明和调用函数中，所有的指针都可以声明成一个uchar数组。
const path = window.require('path')




let { arch } = process // x64  默认加载 64位 DLL

let dllFilePath = path.resolve('resources/myGetIcon.dll')  //此处没找到，错误会是126

// if (arch === 'x64') {
//     dllFilePath = path.resolve('resources/MYDLLDEMO_x64')
// }


// 映射到C语言 int数组类型,并导出
const int16 = ArrayType(ref.types.int32)
const uchar = ArrayType(ref.types.uchar)
const char = ArrayType(ref.types.char)
// 加载 DLL文件,无需写扩展名,将DLL中的函数映射成JS方法
// 导出为JS方法
const MyDellDemo = new ffi.Library(dllFilePath, {
    // 方法名必须与C函数名一致 ，此处没找到，错误会是127
    myDllGetIcon: [
        'int32',        // 对应 C函数返回类型
        ['char']          //对应 C函数的参数列表
    ],
    // addPtr: ['void', ['int', 'int', 'int*']],
    // initArray: ['void', [IntArray, 'int']]
})

// module.exports = {+
function getIcon(fileName) {
    return MyDellDemo.myDllGetIcon(fileName)
}
x = getIcon("C:\\Program Files\\Genshin Impact\\launcher.exe")
console.log('得到的值', x)
console.log('为什么每次都不一样啊', x.toString(16))




//     addPtr(x, y) {
//         var intBuf = ref.alloc(ref.types.int, 100)
//         MyDellDemo.addPtr(x, y, intBuf)
//         return ref.deref(intBuf)
//     },
//     initArray(len) {
//         let myArray = new IntArray(len)
//         MyDellDemo.initArray(myArray, len)
//         let result = []
//         for (var i = 0; i < len; i++) {
//             result.push(myArray[i])
//         }
//         return result
//     }
// }