//useMyDll3.js

const ffi = window.require('ffi-napi')
var ref = window.require('ref-napi')
var ArrayType = window.require('ref-array-napi')
const path = window.require('path')
// const ffi = require('ffi-napi')
// var ref = require('ref-napi')
// var ArrayType = require('ref-array-napi')
// const path = require('path')



let { arch } = process // x64  默认加载 64位 DLL

let dllFilePath = path.resolve('resources/myDll3.dll')

// if (arch === 'x64') {
//     dllFilePath = path.resolve('resources/MYDLLDEMO_x64')
// }


// 映射到C语言 int数组类型,并导出
const IntArray = ArrayType(ref.types.int)

// 加载 DLL文件,无需写扩展名,将DLL中的函数映射成JS方法
// 导出为JS方法
const MyDellDemo = new ffi.Library(dllFilePath, {
    // 方法名必须与C函数名一致
    myAdd: [
        'int',        // 对应 C函数返回类型
        ['int', 'int'] //对应 C函数的参数列表
    ],
    // addPtr: ['void', ['int', 'int', 'int*']],
    // initArray: ['void', [IntArray, 'int']]
})

// module.exports = {
function add(x, y) {
    return MyDellDemo.myAdd(x, y)
}
console.log(add(12, 51))





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