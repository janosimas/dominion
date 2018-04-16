'use strict';

import path from 'path';
import KoaStatic from 'koa-static';
import KoaHelmet from 'koa-helmet';
import KoaWebpack from 'koa-webpack';
import WebpackConfig from './webpack.dev.js';
import { Server } from 'boardgame.io/server';
import Dominion from '../games/dominion/game';

const PORT = process.env.PORT || 8000;
const DEV = process.env.NODE_ENV === 'development';
const PROD = !DEV;

const server = Server({ games: [Dominion]});

if (DEV) {
  server.app.use(
    KoaWebpack({
      config: WebpackConfig,
    })
  );
}

if (PROD) {
  server.app.use(KoaStatic(path.join(__dirname, 'dist')));
  server.app.use(KoaHelmet());
}

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});