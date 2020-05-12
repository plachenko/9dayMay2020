import Phaser from 'phaser'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

// import HelloWorldScene from './scenes/TitleScreen'
import TitleScreen from './scenes/TitleScreen'
import Game from './scenes/Game'
import GameOver from './scenes/GameOver'
import UI from '~/scenes/UI';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scale: {
		zoom: 2,
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 900 }
		}
	},
	scene: [
		TitleScreen, 
		Game, 
		GameOver,
		UI
	]
}

export default new Phaser.Game(config)
