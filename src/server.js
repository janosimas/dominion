
// import path from 'path';
// import KoaStatic from 'koa-static';
import { Server } from 'boardgame.io/server';
import Dominion from './games/dominion/game';
const server = Server({ games: [Dominion] });
// const buildPath = path.join(__dirname, '../build');
// server.app.use(KoaStatic(buildPath));
server.run(8000); 