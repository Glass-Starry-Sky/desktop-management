
const fs = require("fs");
const path = require("path")

// var express = require('express');
// var app = module.exports = express();
// //配置
// app.configure(function(){
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(express.cookieParser('keyboard cat'));
//   app.use(express.session());
//   app.use(app.router);
//   app.use(express.static(__dirname + '/images')); //静态文件目录
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });



function saveBase64Image(base64Image, name) {
    //--保存base64图片POST方法
    // app.post('/upload', function(req, res,base64Image){
    //--接收前台POST过来的base64
    // var imgData = req.body.imgData;


    //过滤data:URL
    // “data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0”
    // 需过滤成：“iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0”
    var base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');

    console.log('saveImageToMemory的path信息->', path.resolve('.', 'imgResources', name))
    let exists = fs.existsSync(path.resolve('.', 'imgResources'));
    //不存在则创建该文件夹
    exists ? "" : fs.mkdirSync(path.resolve('.', 'imgResources'))

    fs.writeFileSync(path.resolve('.', 'imgResources', name), dataBuffer);

    // fs.writeFile("out.png", dataBuffer, function (err) {
    //     if (err) {
    //         res.send(err);
    //     } else {
    //         res.send("保存成功！");
    //     }
    // });






    // });
    // if (!module.parent) {
    //   app.listen(8000);
    //   console.log('Express started on port 8000');
    // }


}

export default saveBase64Image