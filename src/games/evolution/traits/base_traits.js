import BurrowingCards from './burrowing';
import ForagingCards from './foraging';
import ClimbingCards from './climbing';
import CooperationCards from './cooperation';
import CarnivoreCards from './carnivore';
import DefensiveHerdingCards from './defensive_herding';
import FatTissueCards from './fat_tissue';
import FertileCards from './fertile';
import HardShellCards from './hard_shell';
import HornsCards from './horns';
// import IntelligenceCards from './intelligence';
import LongNeckCards from './long_neck';
import SymbiosisCards from './symbiosis';
import WarningCallCards from './warning_call';
import AmbushCards from './ambush';

const BaseTraits = [
  ...AmbushCards,
  ...BurrowingCards,
  ...CarnivoreCards,
  ...ClimbingCards,
  ...CooperationCards,
  ...DefensiveHerdingCards,
  ...FatTissueCards,
  ...FertileCards,
  ...ForagingCards,
  ...HardShellCards,
  ...HornsCards,
  // ...IntelligenceCards,
  ...LongNeckCards,
  ...SymbiosisCards,
  ...WarningCallCards
];

export default BaseTraits;