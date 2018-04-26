import { Client } from 'boardgame.io/react';
import Evolution from './game';
import EvolutionBoard from './board';

const App = Client({
  game: Evolution,
  numPlayers: 2,
  board: EvolutionBoard,
  multiplayer: false,
});

export default App;
