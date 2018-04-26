import { Client } from 'boardgame.io/react';
import Dominion from './game';
import DominionBoard from './board';

const App = Client({
  game: Dominion,
  numPlayers: 2,
  board: DominionBoard,
  multiplayer: { server: 'localhost:8000' },
});

export default App;
