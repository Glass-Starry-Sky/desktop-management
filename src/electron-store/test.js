//转换16进制的图片使用，目前还没有用
function Str2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    //                return window.btoa( binary );
    return binary;
}

let s = e.data.imageData // 获取到的16进制数据
_this.Str2Bytes(s)
let str = _this.arrayBufferToBase64(_this.Str2Bytes(s));//转换字符串
let outputImg = document.createElement('img');
outputImg.src = 'data:image/png;base64,' + str;
document.body.appendChild(outputImg);


