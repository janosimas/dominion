import { Client } from 'boardgame.io/react';
import Dominion from './games/dominion/game';
import DominionBoard from './games/dominion/board';

const App = Client({
  game: Dominion,
  numPlayers: 2,
  board: DominionBoard
});

export default App;
