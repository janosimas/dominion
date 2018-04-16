import { Client } from 'boardgame.io/react';
import Dominion from './games/dominion/game';
import DominionBoard from './games/dominion/board';

const App = Client({
  game: Dominion,
  numPlayers: 1,
  board: DominionBoard,
  multiplayer: { server: 'localhost:8000' }
});

export default App;
