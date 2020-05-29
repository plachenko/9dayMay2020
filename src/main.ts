import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config = {
	type: Phaser.AUTO,
	width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
	physics: {
		default: 'matter',
		matter: {
			gravity: {
        y: 1,
      },
      debug: true
		}
	},
	scene: [
    HelloWorldScene
  ]
}

export default new Phaser.Game(config)
