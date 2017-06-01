
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		this.load.tilemap('Nivel_1','assets/niveles/nivel1.json', null, Phaser.Tilemap.TILED_JSON);
		
		this.load.image('tileSet', 'assets/scifi_platformTiles_32x32.png');
		this.load.image('background_LVL_1', 'assets/backgrounds/castillo.jpg');
		this.load.image('The_End', 'assets/backgrounds/the_end.jpg');

		this.load.image('blank', 'assets/backgrounds/blank.png');
		this.load.image('MainMenu_Logo', 'assets/backgrounds/MainMenu.png');		
		
		this.load.image('picture_1', 'assets/backgrounds/foto_1.jpg');
		this.load.image('picture_2', 'assets/backgrounds/foto_2.jpg');
		this.load.image('picture_3', 'assets/backgrounds/foto_3.jpg');
		this.load.image('picture_4', 'assets/backgrounds/foto_4.jpg');

		this.load.spritesheet('karla','assets/karla.png',32, 48);
		this.load.spritesheet('rulo','assets/rulo.png',32, 48);		
		this.load.spritesheet('distancia','assets/distancia.png',32, 48);
		this.load.spritesheet('fire','assets/fire.png',32, 32);

		this.load.image('star','assets/star.png');
		this.load.image('diamond','assets/diamond.png');
		this.load.image('ring','assets/ring.png');
				
		this.load.audio('Romantic_Music',['assets/sonidos/romantica.mp3','assets/sonidos/romantica.ogg']);
		this.load.audio('Level_1_Music',['assets/sonidos/BellHell.mp3','assets/sonidos/BellHell.ogg']);
		this.load.audio('Boss_Music',['assets/sonidos/Boss_01.ogg']);
		this.load.audio('Victory_Music',['assets/sonidos/Victory.mp3']);
		
		this.load.audio('magic',['assets/sonidos/magia.mp3']);
		this.load.audio('kill_explotion',['assets/sonidos/kill_explotion.mp3']);
		this.load.audio('after_explotion',['assets/sonidos/after_explotion.mp3']);
		this.load.audio('stars_laser',['assets/sonidos/laser.wav']);
		
		
	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Cargando", {font:"20px monospace", fill: "#fff"});
		this.loadingText.anchor.setTo(0.5,0.5);

		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('Level_1_Music') && this.ready == false)
		{
			this.ready = true;
			//this.state.start('Memories', true, false, 1);
			this.state.start('MainMenu');
		}

	}

};
