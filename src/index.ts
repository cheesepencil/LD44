require('./index.html');
require('./styles/master.css');
import { LDGame } from './game';
import { gameConfig } from './gameConfig';

window.onload = () => {
    let game = new LDGame(gameConfig);
};