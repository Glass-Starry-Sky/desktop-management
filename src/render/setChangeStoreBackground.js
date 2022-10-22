import getBackgroundString from './backgroundRead'
import estoreBackground from '../electron-store/estoreBackground'

/**----------------------------------------------------------------------------
* 基础修改background文件模板
------------------------------------------------------------------------------*/
const setChangeStoreBackground = (callback) => {
    let dataStr = getBackgroundString()
    if (dataStr.hasOwnProperty('backgroundList')) {
        let tempList = callback(dataStr)
        // 重新存入estore
        estoreBackground.store = {
            ...tempList
        }
    }
}


export default setChangeStoreBackground