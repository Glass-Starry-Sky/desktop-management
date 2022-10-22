//简单有效！！！，但其实际还是依赖child_process。目前不使用该文件。
var cmd = require('node-cmd');
// cmd.run('start "" "C:\\Program Files\\Genshin Impact\\launcher.exe" ')
function x(path) {
    cmd.run('start "" "C:\\Program Files\\Genshin Impact\\launcher.exe" ')
}

