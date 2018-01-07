/* ===================================
 * server Startup file
 * Created by wangchengjun on 2017/9/14.
 * Copyright 2017 Yooli, Inc.
 * =================================== */
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// Disable the development environment when switching to development mode
// A unique dual change check cycle for faster applications
enableProdMode();

const listenPort = 4200;
const app = express();

// gzip/deflate outgoing responses Open gzip compression
app.use(compression());
app.use(bodyParser.json({ limit: '5024kb' }));
app.use(bodyParser.json({ type: 'application/vnd.app+json', limit: '5024kb' }));
app.use(bodyParser.urlencoded({ extended: false }));
// Define the cookie parser

const DIST_FOLDER = join(__dirname, '..', 'dist');
console.log('DIST_FOLDER === ', DIST_FOLDER);

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('../frontend/dist/server/main.bundle');

app.engine('html', ngExpressEngine({
	bootstrap: AppServerModuleNgFactory,
	providers: [
		provideModuleMap(LAZY_MODULE_MAP)
	]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// Rest API endpoints
// Route(app);
app.use('/testApi',    (req, res) => {
	res.json({ req });
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
	maxAge: '1y'
}));

// ALl regular routes use the Universal engine
app.get('*', (req, res) => {
	res.render('index', { req });
});

app.listen(listenPort, () => {
	console.log('=====================================================');
	console.log(`listening on http://localhost:${listenPort}`);
	console.log('SERVICES START AT ' + new Date());
	console.log('=====================================================');
});
