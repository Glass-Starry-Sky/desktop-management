
const fs = require("fs");
const path = require("path")



function deleteImageFromMemory(name) {
    let exists = fs.existsSync(path.resolve('.', 'imgResources', name));
    if (exists) {
        fs.unlink(path.resolve('.', 'imgResources', name), function (error) {
            if (error) {
                console.log(error);
                return false;
            }
            console.log('删除文件成功');

        })
    } else {

    }


}

export default deleteImageFromMemory