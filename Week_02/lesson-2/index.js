var child_process = require("child_process");
var url = `file://${__dirname}/index.html`,
      cmd = '';
    switch (process.platform) {
        case 'wind32':
            cmd = 'start';
            break;

        case 'linux':
            cmd = 'xdg-open';
            break;

        case 'darwin':
            cmd = 'open';
            break;
    }

    child_process.exec(cmd + ' ' + url);