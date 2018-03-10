import populateModule from '../utils'

import festival from './cards/festival'
import village from './cards/village'
import laboratory from './cards/laboratory'
import smith from './cards/smith'
import woodcutter from './cards/woodcutter'
import militia from './cards/militia'


let module = {
  cards: [],
  custom_actions: [],
  custom_moves: []
}

populateModule(module, [ festival,
                         village,
                         laboratory,
                         smith,
                         woodcutter,
                         militia
                        ]);

export default module;