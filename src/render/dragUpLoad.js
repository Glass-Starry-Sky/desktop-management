
//该文件暂时不使用
var dragList = []
var curId = 0
window.onload = function () {

    document.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()

        // var reader = new FileReader();
        let name = ''
        let path = ''
        let id = ''
        let changeFlag = 0
        Array.from(e.dataTransfer.files).forEach((f) => {
            // console.log('File(s) you dragged here: ', f.name, f.path)
            name = f.name
            path = f.path
            id = (++curId) + ""
            let obj = { id, name, path }
            dragList.push(obj)
            changeFlag = 1 - changeFlag
        })
        console.log('dragList:', dragList)
        //---读取文件的方式
        // reader.onload = function () {
        //     console.log("成功" + this.result);
        // }
        // reader.onerror = function () {
        //     alert("读取失败");
        // }


        // for (const index in e.dataTransfer.files) {
        //     // dragList[index].path = e.dataTransfer.files.path
        //     // console.log(dragList[index].path)
        //     reader.readAsDataURL(e.dataTransfer.files[0]);
        // }
        // alert('123')
    })
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    // }
}


export default dragList