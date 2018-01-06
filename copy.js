const fs = require('fs');
const path = require('path');
const program = require('commander');
const fse = require('fs-extra');
const _ = require('lodash');
const execSync = require('child_process').execSync;

program
.version('0.0.1')
.option('-e, --env [type]', 'Add environment')
.option('-b, --bundle [type]', 'Add server bundle')
.parse(process.argv);

const Env = program['env'] || 'dev';
const tmpDir = 'backend/.tmp';

const Tools = {
    
    /**
     * 获取指定根目录
     * @param dir
     * @returns {string}
     */
    baseDirPath: (dir) => {
        return path.resolve(__dirname, /*'..',*/ dir);
    },
    
    /**
     * 文本替换
     * @param filePath
     * @param sourceStr
     * @param newStr
     */
    replaceText: (filePath, sourceStr, newStr) => {
        let fileBody = fs.readFileSync(filePath, { encoding: 'utf8' });
        if (fileBody) {
            fileBody = fileBody.replace(sourceStr, newStr);
            fs.writeFileSync(filePath, fileBody, { encoding: 'utf8' });
        }
    },
    
    /**
     * 休眠
     * @param second
     */
    sleep: (second) => {
        second = second || 3; // 默认3秒
        const waitUntil = new Date(new Date().getTime() + second * 1000);
        while (waitUntil > new Date()) {
        }
    },
    
    /**
     * 文件拷贝
     * @param targetDir
     * @param excludes
     * @param callback
     */
    copy: (targetDir, excludes, callback) => {
        excludes = excludes || [];
        const src = Tools.baseDirPath(targetDir);
        const dist = Tools.baseDirPath(tmpDir);
        execSync(`rm -rf ${dist}`);
        fse.ensureDirSync(dist); // 文件目录不存在则创建
        
        const files = Tools.getAllFiles(src);
        let count = 0, overFlag = false;
        for (const file of files) {
            count += 1;
            for (const exclude of excludes) {
                if (!file.includes(exclude)) {
                    const newFile = file.replace('backend', tmpDir);
                    fse.ensureFileSync(newFile); // 文件目录不存在则创建
                    const fileReadStream = fs.createReadStream(file);
                    const fileWriteStream = fs.createWriteStream(newFile);
                    fileReadStream.pipe(fileWriteStream);
                    fileWriteStream.on('close', () => {
                        if (count === files.length && !overFlag) {
                            // console.log('copy over.');
                            overFlag = true;
                            callback();
                        }
                    });
                }
            }
        }
    },
    
    /**
     * 获取文件夹下面的所有的文件(包括子文件夹)
     * @param {String} dir
     * @returns {Array}
     */
    getAllFiles: (dir) => {
        let AllFiles = [];
        const iteration = (dirPath) => {
            const [dirs, files] = _(fs.readdirSync(dirPath)).partition(p => fs.statSync(path.join(dirPath, p)).isDirectory());
            files.forEach(file => AllFiles.push(path.join(dirPath, file)));
            for (const _dir of dirs) {
                if (!_dir.includes('node_modules')) {
                    iteration(path.join(dirPath, _dir));
                }
            }
        };
        iteration(dir);
        return AllFiles;
    },
    
    /**
     * 删除目录及其子文件
     * @param path
     */
    deleteFolder: (path) => {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file) {
                let curPath = path + '/' + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    Tools.deleteFolder(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    },
    
    /**
     * seo 服务端文件编译替换
     */
    serverBundle: () => {
        let serverPath = path.join(__dirname, /*'..',*/ `/${tmpDir}/server.ts`);
        const data = fs.readFileSync(serverPath, 'utf8');
        const lines = data.split('\n');
        let begin = 0;
        let end = 0;
        for (let i = 0; i < lines.length; i++) {
            if (/if\s*\(Config.production\)\s*{/.test(lines[i])) begin = i;
            if (/Route\s*\(app\)/.test(lines[i])) end = i + 1;
        }
        for (let j = begin; j <= end; j++) lines[j] = '';
        let fileData = '';
        for (let ii = 0; ii < lines.length; ii++) {
            if (ii === end) {
                lines[ii] = 'Route(app);';
            }
            if (lines[ii]) {
                fileData += lines[ii] + '\r\n';
            }
        }
        fs.writeFileSync(serverPath, fileData, 'utf8');
    }
};

// 拷贝后端所有文件,避免操作源文件
Tools.copy('backend', ['logs', 'test'], () => {
    // update config
    const filePath = path.join(__dirname, /*'..', */`/${tmpDir}/config/index.ts`);
    if (fs.existsSync(filePath)) {
        Tools.replaceText(filePath, /dev/, Env);
        Tools.replaceText(filePath, /\.\/environment\.[\S]+/, './environment.' + Env + '\';');
    }
    // update server.ts
    const serverPath = path.join(__dirname, /*'..',*/ `/${tmpDir}/server.ts`);
    if (fs.existsSync(serverPath)) {
        // Tools.replaceText(serverPath, /frontend\/dist/g, '../frontend/dist');
        Tools.replaceText(serverPath, /\.\.\/dist/g, '../../dist');
    }
    // dynamic update config env
    if (Env === 'dev' || Env === 'test') {
        // update production
        const confDevFilePath = path.join(__dirname, /*'..',*/ `/${tmpDir}/config/environment.${Env.toLowerCase()}.ts`);
        Tools.replaceText(confDevFilePath, /production:\s*false/, 'production: true');
    }
    
    if (program['bundle']) {
        Tools.serverBundle();
    }
});