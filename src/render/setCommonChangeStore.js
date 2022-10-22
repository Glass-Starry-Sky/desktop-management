import getDataString from './configRead.js'
import estore from '@/electron-store/estore'

/**----------------------------------------------------------------------------
* 基础修改config文件模板
------------------------------------------------------------------------------*/
const setCommonChangeStore = (callback) => {
    let dataStr = getDataString()
    if (dataStr.hasOwnProperty('tabs')) {
        let tempList = callback(dataStr)
        // 重新存入estore
        estore.store = {
            ...tempList
        }
    }
}


export default setCommonChangeStore