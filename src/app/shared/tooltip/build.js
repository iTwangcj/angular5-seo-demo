/* ===================================
 * npm Plug-in generator
 * Created by chengjun.wang on 2017/11/11.
 * Copyright 2017 FEMock, Inc.
 * =================================== */

// ShellJS.
require('shelljs/global');
// Colors.
const chalk = require('chalk');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ngc = require('@angular/compiler-cli/src/main').main;
const libName = require('./package.json').name;

const rootFolder = path.join(__dirname);
const compilationFolder = path.join(rootFolder, libName);
const tmpFolder = path.join(rootFolder, '.tmp');

const config = {
	debug: false,
	uglifyJs: true,
	npmLink: false
};

let node_modules_path = 'node_modules';
const paths = require.main.paths;
const tmpPaths = [];
if (paths && paths.length) {
	for (const path of paths) {
		if (fs.existsSync(path)) {
			tmpPaths.push(path);
		}
	}
	if (tmpPaths.length) {
		node_modules_path = tmpPaths.sort((a, b) => a.length - b.length)[0];
	}
}

return Promise.resolve()
.then(() => global.echo('Start Cleans bundles folders...'))

// Cleans tmpFolder & bundles folders
.then(() => global.rm('-Rf', `${libName}`))
.then(() => global.rm('-Rf', `${tmpFolder}`))
.then(() => global.echo(`Cleans tmpFolder & bundles folders ${libName} completed.`))

// TSLint with Codelyzer
.then(() => global.exec(`tslint ./${rootFolder}/**/*.ts`))
.then(() => global.echo(chalk.green('TSLint completed')))

// Create temporary directory
.then(() => {
	if (!fs.existsSync(tmpFolder)) {
		global.mkdir('.tmp');
	}
})

// Create LICENSE.
.then(() => global.echo(chalk.blue('Start Create LICENSE...')))
.then(() => {
	const baseLICENSE = `The MIT License

Copyright (c) 2016-2017 FEMock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.`;
	fs.writeFileSync('./.tmp/LICENSE', baseLICENSE);
})
.then(() => global.echo(chalk.green('Create LICENSE completed')))

// Create tsconfig.json.
.then(() => global.echo(chalk.blue('Start Create tsconfig.json...')))
.then(() => {
	const baseTsconfigJson = `{
    "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "module": "es2015",
        "moduleResolution": "node",
        "noEmitOnError": false,
        "noImplicitAny": false,
        "removeComments": false,
        "sourceMap": false,
        "declaration": true,
        "target": "es5",
        "outDir": "${compilationFolder}",
        "skipLibCheck": true,
        "suppressImplicitAnyIndexErrors": false,
        "lib": [
            "es2015",
            "dom"
        ]
    },
    "typeRoots": [
        "${node_modules_path}/@types"
    ],
    "exclude": [
        "${node_modules_path}"
    ],
    "files": [
        "../index.ts"
    ],
    "angularCompilerOptions": {
        "skipTemplateCodegen": true,
        "strictMetadataEmit": true,
        "annotateForClosureCompiler": true
    }
}`;
	fs.writeFileSync('./.tmp/tsconfig.json', baseTsconfigJson);
})
.then(() => global.echo(chalk.green('Create tsconfig.json completed')))

// Create webpack.config.js.
.then(() => global.echo(chalk.blue('Start Create webpack.config.js...')))
.then(() => {
	const baseWebpackConfig = `
        const path = require('path');
        const webpack = require('${node_modules_path}/webpack');
        
        function root (filePath) {
            return path.resolve(__dirname, filePath || '');
        }
        
        module.exports = {
            
            devtool: '${config.debug ? 'eval-source-map' : 'none'}',
            
            resolve: {
                extensions: ['.ts', '.js']
            },
            
            entry: path.join('${rootFolder}', 'index.ts'),
            
            output: {
                path: root('../${libName}/bundles'),
                publicPath: '/',
                filename: '${config.uglifyJs ? 'core.umd.min.js' : 'core.umd.js'}',
                library: '${libName}-core',
                libraryTarget: 'umd'
            },
            
            // require those dependencies but don't bundle them
            externals: [/^@angular\\//, /^rxjs\\//],
            
            module: {
                rules: [{
                    enforce: 'pre',
                    test: /\\.ts$/,
                    loader: 'tslint-loader',
                    exclude: ['${node_modules_path}']
                }, {
                    test: /\\.ts$/,
                    loader: 'awesome-typescript-loader',
                    options: {
                        declaration: false
                    },
                    exclude: [/\\.spec\\.ts$/]
                }]
            },
            
            plugins: [
                new webpack.LoaderOptionsPlugin({
                    options: {
                        tslintLoader: {
                            emitErrors: false,
                            failOnHint: false
                        }
                    }
                }),
                
                ${config.uglifyJs ? `new webpack.optimize.UglifyJsPlugin()` : ''}
            ]
        };
    `;
	fs.writeFileSync('./.tmp/webpack.config.js', baseWebpackConfig);
})
.then(() => global.echo(chalk.green('Create webpack.config.js completed')))

// Compile using ngc.
.then(() => global.echo('Start AoT compilation...'))
.then(() => ngc(['--project', `${tmpFolder}/tsconfig.json`]))
.then(() => global.echo('AoT compilation completed'))

// Creates umd bundle
.then(() => global.echo('Start bundling...'))
.then(() => {
	global.exec(`webpack --config ${tmpFolder}/webpack.config.js --progress --colors`);
})
.then(() => global.echo(chalk.green('Bundling completed')))

// Copy package files
.then(() => Promise.resolve()
	.then(() => _relativeCopy('LICENSE', tmpFolder, compilationFolder))
	.then(() => _relativeCopy('package.json', rootFolder, compilationFolder))
	.then(() => _relativeCopy('README.md', rootFolder, compilationFolder))
	.then(() => console.log('Package files copy succeeded.'))
)
// Delete temporary directory
.then(() => global.rm('-Rf', `${tmpFolder}`))

// Compile the package to local
.then(() => {
	if (config.npmLink) {
		global.exec(`cd ${node_modules_path} && npm link ${compilationFolder} && cd ${__dirname}`);
	}
})

// error catch
.catch(e => {
	console.error('\Build failed. See below for errors.\n');
	console.error(e);
	process.exit(1);
});

// Copy files maintaining relative paths.
function _relativeCopy (fileGlob, from, to) {
	return new Promise((resolve, reject) => {
		glob(fileGlob, { cwd: from, nodir: true }, (err, files) => {
			if (err) reject(err);
			files.forEach(file => {
				const origin = path.join(from, file);
				const dest = path.join(to, file);
				let data = fs.readFileSync(origin, 'utf-8');
				_recursiveMkDir(path.dirname(dest));
				if (fileGlob === 'package.json') {
					data = versionUpdate(JSON.parse(data), origin);
				}
				fs.writeFileSync(dest, data);
				resolve();
			});
		});
	});
}

// Recursively create a dir.
function _recursiveMkDir (dir) {
	if (!fs.existsSync(dir)) {
		_recursiveMkDir(path.dirname(dir));
		fs.mkdirSync(dir);
	}
}

// Update version number
function versionUpdate (data, output) {
	const version = data.version;
	if (version && version.includes('.')) {
		if (!config.debug) {
			const vStr = version.split('.');
			let vs1 = [vStr[0]];
			let vs2 = [vStr[1]];
			let vs3 = [vStr[2]];
			const isNumber = (str) => {
				return /^[0-9]*$/.test(str.toString());
			};
			if (!isNumber(vs1) || !isNumber(vs2) || !isNumber(vs3)) {
				throw Error(`Incorrect version number. version: ${version}`);
			}
			vs1 = Number(vs1);
			vs2 = Number(vs2);
			vs3 = Number(vs3);
			vs3 += 1;
			if (vs3 >= 100) {
				vs3 = 0;
				vs2 += 1;
				if (vs2 >= 100) {
					vs2 = 0;
					vs1 += 1;
				}
			}
			// update version
			data.version = [vs1, vs2, vs3].join('.');
		}
		
		// update core
		data.main = config.uglifyJs ? 'bundles/core.umd.min.js' : 'bundles/core.umd.js'; // fix it [object object] error
		
		const result = JSON.stringify(data, null, 4);
		fs.writeFileSync(output, result);
		
		return result;
	}
}
