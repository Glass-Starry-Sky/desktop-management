// readImage.js
var fs = require('fs');
const path = require('path')
// import getBackgroundString from '@/render/backgroundRead'


/**-------------------------------------------------------------
*   读取  imgResources文件夹内的图片，并输出base64格式，
*   如果说第一次进入到背景界面有卡顿现象，大概出自此函数
--------------------------------------------------------------*/
function readResourcesImage(item) {

    let exists = fs.existsSync(path.resolve('.', 'imgResources', item.path));
    if (exists) {
        let data = fs.readFileSync(path.resolve('.', 'imgResources', item.path), 'base64')
        // console.log(111, data);
        // data:image/png;base64,
        //重新把头部加上
        data = `data:${item.type};base64,` + data
        return data
    }


}
export default readResourcesImage