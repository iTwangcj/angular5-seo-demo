// ShellJS.
require('shelljs/global');
// Colors.
const chalk = require('chalk');
const path = require('path');
const program = require('commander');
const tmpDir = path.join(__dirname, '../backend/.tmp');

program.version('0.0.1').option('-e, --env [type]', 'Add environment').parse(process.argv);

const Env = program['env'] || 'dev';
const EnvLower = Env.toLowerCase();

return global.Promise.resolve()
.then(() => global.echo(chalk.blue('Start Cleans build files...')))
.then(() => global.rm('-Rf', tmpDir))
.then(() => global.rm('-Rf', 'dist'))
.then(() => global.echo(chalk.green('Cleans build files completed.')))

.then(() => global.echo(chalk.blue('Start SEO client compilation...')))
.then(() => global.exec(`ng build --prod --aot -e ${EnvLower}`))
.then(() => global.echo(chalk.green('SEO client compilation completed.')))

.then(() => global.echo(chalk.blue('Start SEO server compilation...')))
.then(() => global.exec(`ng build --prod --aot -e ${EnvLower} --app 1 --output-hashing=false`))
.then(() => global.echo(chalk.green('SEO server compilation completed.')))
.then(() => global.echo(chalk.blue('Start Backend files copy...')))
.then(() => global.exec(`node copy --env=${EnvLower}`))
.then(() => global.echo(chalk.green('Backend files copy completed.')))
.then(() => global.echo(chalk.blue('Start Webpack compilation...')))
.then(() => global.exec(`webpack --config webpack.server.config.js --progress --colors`))
.then(() => global.echo(chalk.green('Webpack compilation completed.')))

.then(() => global.echo(chalk.blue('Start Cleans temp files...')))
// .then(() => global.rm('-Rf', tmpDir))
// .then(() => global.rm('-Rf', 'dist/server/'))
.then(() => global.echo(chalk.green('Cleans temp files completed.')))
.then(() => global.echo(chalk.green('SEO compilation completed.')))

.then(() => global.echo(chalk.blue('Server is open')))
.then(() => global.exec(`node dist/server.js | bunyan`))

// error catch
.catch(e => {
    console.error('\Build failed. See below for errors.\n');
    console.error(e);
    process.exit(1);
});
