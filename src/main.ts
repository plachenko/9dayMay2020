import Phaser from 'phaser'
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js';

import {
	BootScene,
	TitleScreen,
	MainGame,
	GameOver,
	UI
} from './scenes';

// import HelloWorldScene from './scenes/TitleScreen'

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
		BootScene,
		TitleScreen, 
		MainGame, 
		GameOver,
		UI
	]
}

const game = new Phaser.Game(config);

export default game;