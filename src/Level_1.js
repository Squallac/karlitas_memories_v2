
BasicGame.Level_1 = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};


var player;
var rulo;

var cursors;
var map;
var background;

var pictures = [];

var platforms;
var hurtSFX;
var music;
var jumpTimer = 0;

var is_animation_playing = false;

var animation_started               = false;
var second_animation_started        = false;
var rulo_animation_started          = false;
var blank_animation_started         = true;

var blank;
var blank_counter = 0;
var blank_total_counter = 0;

BasicGame.Level_1.prototype = {

    //Setting up the game
    create: function () {

        this.Set_Up_Physics();
        this.Set_Up_World();
        this.Set_Up_Keys();
        this.Set_Up_Pictures();
        this.Set_Up_Player();
        this.Set_Up_Rulo();
        this.Set_Up_Blank_Screen();
        //this.Play_Background_Music();
    },

    Set_Up_Physics: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 300;
    },

    Set_Up_World: function() {   

        map = this.add.tilemap('Nivel_1');
        map.addTilesetImage('scifi_platformTiles_32x32', 'tileSet');

        background = this.game.add.sprite(0,0,'background_LVL_1');

        bg = map.createLayer('bg');
        platforms = map.createLayer('platforms');

        map.setCollision(308, true, 'platforms');

        this.world.setBounds(0,0,960,640);
        this.camera.y = this.world.height;        
    },

    Set_Up_Keys: function() {
        cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.zKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    },

    Set_Up_Player: function() {
        
        var xOffset = 64;
        var yOffset = 145;

        var posInWorldX = (this.world.width/2) - xOffset;
        var posInWorldY = this.world.height - yOffset;

        player = this.add.sprite(posInWorldX, posInWorldY, 'karla');

        this.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.1;  

        player.animations.add('left', [0,1,2,3], 10, true);
        player.animations.add('right', [5,6,7,8], 10, true);
    },

    Set_Up_Rulo: function() {

        var xOffset = 32;
        var yOffset = 145;

        var posInWorldX = (this.world.width/2) - xOffset;
        var posInWorldY = this.world.height - yOffset;

        rulo = this.add.sprite(posInWorldX, posInWorldY, 'rulo');

        this.physics.arcade.enable(rulo);
        rulo.body.collideWorldBounds = true;     

        rulo.frame = 0;   
    },

    Set_Up_Pictures: function() {

        var pictures_margin = 280;

        var pictures_x_position = 0;
        var pictures_y_position = 300;
        var total_pictures = 4;

        for (var index = 0; index < total_pictures; index++) {

            var number_of_picture = index + 1;
            var offsetX = 80;
            var offsetY = 0;

            if (number_of_picture == 2) {
                offsetX = 0;
                offsetY = 25;
            } else if (number_of_picture == 3) {
                offsetX = 0;
                offsetY = 0;
            } else if (number_of_picture == 4) {
                offsetX = -50;
                offsetY = 25;
            }

            var pictures_x_current_position = (pictures_margin * index) + offsetX;
            var picture_y_current_position = pictures_y_position + offsetY;

            pictures[index] = this.game.add.sprite(pictures_x_current_position, picture_y_current_position, 'picture_' + number_of_picture);
            pictures[index].scale.setTo(0.5, 0.5);
        }
    },

    Set_Up_Blank_Screen: function() {
        blank = this.add.sprite(this.camera.x, this.camera.y,'blank');
        blank.alpha = 0;
    },

    //GamePlay
    update: function () {

        this.Handle_Collisions();

        if (!is_animation_playing) {
            this.Handle_Player_Movement();
        } 

        this.Handle_Camera_Movement();
        //this.Handle_Debug();
    },

    Handle_Collisions: function() {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(rulo, platforms);
    },

    Handle_Player_Movement: function() {
        player.body.velocity.x = 0;

        //Movement
        if(cursors.left.isDown) {
            player.body.velocity.x = -150;
            player.animations.play('left');
            
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 150;
            player.animations.play('right');
            
        } else {
            player.animations.stop();
            player.frame = 4;
        }
        
        //JUMP
        if (cursors.up.isDown && player.body.blocked.down && (this.time.now > jumpTimer)) {
            player.body.velocity.y = -280;
            jumpTimer = this.time.now + 750;
        }

        //Attack
        if (this.zKey.isDown) {
            console.log('ATACK!');
        }
    },

    Handle_Camera_Movement: function() {
        this.game.camera.x = player.position.x * 0.5;
        this.game.camera.y = player.position.y * 0.8;
        
        background.x = this.game.camera.x;
        background.y = this.game.camera.y;
    },

    Handle_Debug: function() {
        this.game.debug.spriteInfo(player, 0 , 150);
        this.game.debug.cameraInfo(this.game.camera, 0 , 350);
    },

    Blank_Animation: function() {
        
        this.Play_SFX(2); 
        blank_total_counter++;            
        
        blank.x = this.camera.x;
        blank.y = this.camera.y;
        blank.alpha = 1;

        if (blank_total_counter >= 3) {
            blank.alpha = 0;
            blank_animation_started = true;
            dead_enemies_animation_started = false;
        }
    },

    Play_SFX: function(sfx) {
        if (sfx == 1) {
            noise = this.add.audio('enemy_sound');
            noise.play();

        } else if (sfx == 2) {
            magic = this.add.audio('magic');
            magic.play();
        }
        
    },

    Play_Background_Music: function() {
        music = this.add.audio('Level_1_Music');
        romantic_music = this.add.audio('Romantic_Music');
        music.fadeIn(1000, true);        
        //music.play(null, null, 0.5);
    }
};
