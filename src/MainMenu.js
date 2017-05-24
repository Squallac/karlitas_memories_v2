
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

var romantic_music;
var logo;

BasicGame.MainMenu.prototype = {

	create: function () {

		
		logo = this.game.add.sprite(this.game.width / 2, this.game.height / 2,'MainMenu_Logo');
		logo.anchor.setTo(0.5, 0.5);

		romantic_music = this.add.audio('Romantic_Music');
		romantic_music.play();

		this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 200, "PRESS ENTER", {font:"20px monospace", fill: "#fff"});
		this.loadingText.anchor.setTo(0.5,0.5);

		this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		this.enterKey.onDown.add(this.PlayGame, this);	
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	PlayGame: function (pointer) {

		//	And start the actual game
		romantic_music.stop();
		this.game.state.start('Level_1');

	}

};
