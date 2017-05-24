
BasicGame.Memories = function (game) {

	this.music = null;
	this.playButton = null;

};

var cursors;
var current_number_of_memory;
var background;
var music;

BasicGame.Memories.prototype = {

	init: function(number_of_memory) {

		current_number_of_memory = number_of_memory;		
	},
	
	create: function () {

		
		music = this.add.audio('background_music_memories');
		music.fadeIn(500,true);
        music.play();

		var memory_text_4 = 'Y que hay de nuestros tiempos en la universidad? Recuerdo cuando te visitaba en ICB \
		y que tu me visitabas a IIT... nos quedabamos horas y horas platicando y riendo a carcajadas.\
		yo siempre te compraba aguas y tu me llevabas chucherias, como el Chocotorro. Te amo mi hermosa\
		tu has hecho muy especiales mis dias de universidad PRESIONA ENTER PARA CONTINUAR';
	
		if (current_number_of_memory < 4) {
			background = this.game.add.sprite(0,0,'memory_' + current_number_of_memory);		
		} else {
			this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, memory_text_4, {font:"20px monospace", fill: "#fff"});
		}		

		this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		
		cursors = this.input.keyboard.createCursorKeys();
	
	},

	update: function () {

		var next_level = current_number_of_memory + 1;
		
		if (this.enterKey.isDown) {
			music.fadeOut(1000);
            music.stop();
            this.state.start('Level_' + next_level);
        } 
	}

};
