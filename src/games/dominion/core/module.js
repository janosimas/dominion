import { populateModule } from '../utils'

import festival from './cards/festival'
import village from './cards/village'
import laboratory from './cards/laboratory'
import smith from './cards/smith'
import woodcutter from './cards/woodcutter'
import militia from './cards/militia'
import cellar from './cards/cellar'
import chapel from './cards/chapel'
import moat from './cards/moat'
import harbinger from './cards/harbinger'
import vassal from './cards/vassal'
import workshop from './cards/workshop'
import bureaucrat from './cards/bureaucrat'
import gardens from './cards/gardens'
import moneylender from './cards/moneylender'
import poacher from './cards/poacher'

let mod = {
  cards: [],
  custom_phases: [],
  custom_moves: []
}

populateModule(mod,
  [
    gardens,
    festival,
    village,
    laboratory,
    smith,
    woodcutter,
    militia,
    cellar,
    workshop,
    chapel,
    moat,
    harbinger,
    vassal,
    bureaucrat,
    moneylender,
    poacher
  ]);

export default mod;