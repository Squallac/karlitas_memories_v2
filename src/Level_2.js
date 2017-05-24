
BasicGame.Level_2 = function (game) {

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
var enemy_one;
var enemy_two;
var enemy_one_speed = 150;
var enemy_two_speed = 100;

var enemy_one_direction = "right";
var enemy_two_direction = "right";
var cursors;
var map;
var background;
var platforms;
var spikes;
var star;
var starCollected = false;
var hurtSFX;
var music;
var jumpTimer = 0;


BasicGame.Level_2.prototype = {

    create: function () {

               
        
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 300;        

        map = this.add.tilemap('Nivel_2');
        map.addTilesetImage('scifi_platformTiles_32x32', 'tileSet');
        background = this.game.add.sprite(0,0,'background_LVL_2');

        platforms = map.createLayer('platforms');
        spikes = map.createLayer('spikes');

        map.setCollisionBetween(188, 580, true, 'platforms');
        map.setCollisionBetween(188, 583, true, 'spikes');

        cursors = this.input.keyboard.createCursorKeys();

        this.Set_Up_World();
        this.Set_Up_Player();
        this.Set_Up_Enemies();
        this.Set_Up_Star();
        this.Play_Background_Music();       

    },

    update: function () {

        this.physics.arcade.collide(player,platforms);
        this.physics.arcade.overlap(player, spikes, this.Player_Hit, null, this);
        this.physics.arcade.collide(star,platforms);
        this.physics.arcade.overlap(player,star, this.starCollect, null, this);
        this.physics.arcade.collide(enemy_one,platforms, this.Move_Enemy);
        this.physics.arcade.collide(enemy_two,platforms, this.Move_Enemy);
        this.physics.arcade.overlap(player, enemy_one, this.Player_Hit, null, this);
        this.physics.arcade.overlap(player, enemy_two, this.Player_Hit, null, this);

        player.body.velocity.x = 0;

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

        if(cursors.up.isDown && player.body.blocked.down && this.time.now > jumpTimer) {
            player.body.velocity.y = -280;
            jumpTimer = this.time.now + 750;
        }

        if ( enemy_two.body.blocked.right == true && enemy_two_direction == "right") {
            enemy_two_speed *= -1;
            enemy_two_direction = "left";
            enemy_two.animations.play('left');
        } else if ( enemy_one.body.blocked.right == true && enemy_one_direction == "right") {
            enemy_one_speed *= -1;
            enemy_one_direction = "left";
            enemy_one.animations.play('left');
        } else if ( enemy_one.body.blocked.left == true && enemy_one_direction == "left") {
            enemy_one_speed *= -1;
            enemy_one_direction = "right";
            enemy_one.animations.play('right');
        } else if ( enemy_two.body.blocked.left == true && enemy_two_direction == "left") {
            enemy_two_speed *= -1;
            enemy_two_direction = "right";
            enemy_two.animations.play('right');
        } else if ( this.checkForCliff(enemy_one_direction, enemy_one) == true) {
            enemy_one_speed *= -1;
            
            if (enemy_one_direction == "right") {
                enemy_one_direction = "left";
                enemy_one.animations.play('left');
            } else {
                enemy_one_direction = "right";
                enemy_one.animations.play('right');
            }

        } else if ( this.checkForCliff(enemy_two_direction, enemy_two) == true) {
            enemy_two_speed *= -1;
            
            if (enemy_two_direction == "right") {
                
                enemy_two_direction = "left";
                enemy_two.animations.play('left');

            } else {

                enemy_two_direction = "right";
                enemy_two.animations.play('right');

            }
        } 

        var transition = false;

        this.game.camera.x = player.position.x * 0.5;
        background.x = this.game.camera.x;
        
    },

    Set_Up_Player: function() {
        player = this.add.sprite(32, 0, 'karla');
        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.2;

        player.animations.add('left', [0,1,2,3], 10, true);
        player.animations.add('right', [5,6,7,8], 10, true);
    },

    Set_Up_Enemies: function() {
        enemy_one = this.add.sprite(732,208,'enemigo');
        enemy_two = this.add.sprite(873,368,'enemigo');

        this.physics.enable(enemy_one,Phaser.Physics.ARCADE);
        this.physics.enable(enemy_two,Phaser.Physics.ARCADE);

        enemy_one.body.collideWorldBounds = true;
        enemy_two.body.collideWorldBounds = true;

        enemy_one.anchor.setTo(0.5, 1);
        enemy_two.anchor.setTo(0.5, 1);

	enemy_one_speed = 150;
        enemy_two_speed = 100;

        enemy_one.animations.add('left', [0,1,2,3], 10, true)
        enemy_one.animations.add('right', [5,6,7,8], 10, true);
        enemy_two.animations.add('left', [0,1,2,3], 10, true)
        enemy_two.animations.add('right', [5,6,7,8], 10, true);

        enemy_one.animations.play('right', 10, true);
        enemy_two.animations.play('left', 10, true);
    },

    Set_Up_World: function() {
         
        this.world.setBounds(0,0,1600,640);            
        
    },

    Set_Up_Star: function() {
        star = this.add.sprite(1300,340,'star');
        this.physics.enable(star,Phaser.Physics.ARCADE);
    },


    Play_Background_Music: function() {
        music = this.add.audio('background_music');
        music.fadeIn(3000,true);        
    },

    Move_Enemy: function() {
        enemy_one.body.velocity.x = enemy_one_speed;
        enemy_two.body.velocity.x = enemy_two_speed;
    },

    checkForCliff: function (side, enemy) {
        
        var offsetX; 

        if (side == "left")
            offsetX = -10;
        else if (side == "right") 
            offsetX = 10;        

        var tile = map.getTileWorldXY(enemy.body.x + offsetX, enemy.body.y + 50, 32, 32, platforms);
        
        if ( enemy.body.blocked.down && tile == null)
            return true;
        else
            return false;
    
        
    },

    starCollect: function () {
        var number_of_memory = 2;
        var state            = this.state;

        music.fadeOut(1000);
        
        setTimeout(function(){
            player.kill();
            star.kill();
            music.stop();
            state.start('Memories', true, false, number_of_memory);
        },1000);
    },

    Player_Hit: function () {

        this.GameOver();
    },


    GameOver: function() {
        player.kill();
        star.kill();

        enemy_one.kill();
        enemy_two.kill();
        
        enemy_one_speed = 150;
        enemy_two_speed = 100;

        enemy_one_direction = "right";
        enemy_two_direction = "right";

        music.fadeOut(1000);
        music.stop();
        this.state.start('Level_2');
    }


};
