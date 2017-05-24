
BasicGame.Level_4 = function (game) {

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
var enemy_one;
var enemy_two;
var enemy_three;
var enemy_one_speed = 200;
var enemy_two_speed = 500;

var enemy_one_direction = "right";
var enemy_two_direction = "right";

var cursors;
var map;
var background;

var foto_1;
var foto_2;
var foto_3;
var foto_4;

var platforms;
var spikes;
var star;
var starCollected = false;
var hurtSFX;
var music;
var jumpTimer = 0;

var enable_animation = false;
var enable_jump      = true;

var animation_started               = false;
var second_animation_started        = false;
var rulo_animation_started          = false;
var blank_animation_started         = true;
var dead_enemies_animation_started  = true;

var blank;
var blank_counter       = 0;
var blank_total_counter = 0;

var dialog_1;
var dialog_2;
var dialog_counter   = 0;
var number_of_dialog = 0;
var dialogs_animation_started = true;

var the_end;


BasicGame.Level_4.prototype = {

    create: function () {
                
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 300;

        map = this.add.tilemap('Nivel_4');
        map.addTilesetImage('scifi_platformTiles_32x32', 'tileSet');

        background = this.game.add.sprite(0,0,'background_LVL_4');

        bg        = map.createLayer('bg');
        platforms = map.createLayer('platforms');
        spikes    = map.createLayer('spikes');

        map.setCollision(702, true, 'platforms');
        map.setCollision(432, true, 'spikes');

        cursors = this.input.keyboard.createCursorKeys();
        this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        var margin = 250;
        var fotos_y = 600;
        var foto_1_x = 350;
        var foto_2_x = foto_1_x + margin;
        var foto_3_x = foto_2_x + margin;
        var foto_4_x = foto_3_x + margin;

        foto_1 = this.game.add.sprite(foto_1_x + 50, fotos_y,'foto_1');
        foto_2 = this.game.add.sprite(foto_2_x, fotos_y + 25,'foto_2');
        foto_3 = this.game.add.sprite(foto_3_x, fotos_y,'foto_3');
        foto_4 = this.game.add.sprite(foto_4_x - 50, fotos_y + 25,'foto_4');

        foto_1.scale.setTo(0.5, 0.5);
        foto_2.scale.setTo(0.5, 0.5);
        foto_3.scale.setTo(0.5, 0.5);
        foto_4.scale.setTo(0.5, 0.5);

        this.Set_Up_World();
        this.Set_Up_Player();
        this.Set_Up_Rulo();
        this.Set_Up_Enemies();

        this.Play_Background_Music();

        blank = this.add.sprite(this.camera.x, this.camera.y,'blank');
    },

    update: function () {

        this.physics.arcade.collide(player,platforms);
        this.physics.arcade.overlap(player, spikes, this.Player_Hit, null, this);
        this.physics.arcade.collide(rulo,platforms);
        this.physics.arcade.collide(star,platforms);
        this.physics.arcade.collide(enemy_one,platforms, this.Move_Enemy);
        this.physics.arcade.collide(enemy_two,platforms, this.Move_Enemy);        
        this.physics.arcade.overlap(player, enemy_one, this.Player_Hit, null, this);
        this.physics.arcade.overlap(player, enemy_two, this.Player_Hit, null, this);
        
        if (!enable_animation) {
            rulo.frame = 0;
            blank.alpha = 0;

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

            if (cursors.up.isDown && player.body.blocked.down && this.time.now > jumpTimer && enable_jump) {
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
            
            var player_near_rulo = 1316;           

            if (player.position.x >= player_near_rulo && player.position.y <= 800) {
                enemy_one_direction = "right";
                enemy_two_direction = "right";
                enemy_one_speed = 30;
                enemy_two_speed = 30;
                enable_animation = true;
                blank.alpha = 1;
            }

        } else {

            if (!animation_started) {
                this.Start_Animation();
                animation_started = true;    
            }

            if (player.position.x >= 1350) {
                
                
                if (!second_animation_started) {
                    player.body.velocity.x  = 0;
                    this.Second_Animation();
                    second_animation_started = true;                    
                }

                if (!rulo_animation_started)
                    this.physics.arcade.overlap(player, rulo, this.Rulo_Animation, null, this);    
                
                if (!blank_animation_started) {
                    blank.alpha = 0;
                    blank_counter++;

                    if(blank_counter >= 30) {
                        this.Blank_Animation();
                        blank_counter = 0;
                    }                    
                }

                if (!dead_enemies_animation_started) {
                    enemy_one.body.velocity.x  = 0;
                    enemy_two.body.velocity.x  = 0;
                    this.Dead_Enemies_Animation();
                    dead_enemies_animation_started = true;
                }    

                if (!dialogs_animation_started) {
                    dialog_counter++;

                    if (this.enterKey.isDown && dialog_counter >= 3) {
                        dialog_counter = 0;
                        this.Start_Dialogs(number_of_dialog);
                    }                    
                    
                }             
            }           
        }

        var chamber_pos_y = 752;           

        this.game.camera.x = player.position.x * 0.5;

        if (player.position.y > chamber_pos_y) {
            this.game.camera.y = player.position.y * 0.8;
            enable_jump = true;
        } else {
            this.game.camera.y = 384;
            enable_jump = false;
        }        
        
        background.x = this.game.camera.x;
        background.y = this.game.camera.y;
        
        //this.game.debug.spriteInfo(player, 0 , 150);
        //this.game.debug.spriteInfo(enemy_one, 350 , 150);
        //this.game.debug.spriteInfo(enemy_two, 350 , 350);
        //this.game.debug.cameraInfo(this.game.camera, 0 , 350);
    },

    Start_Dialogs: function(dialog) {
        if (dialog == 1) {
            dialog_1 = this.game.add.sprite(this.game.camera.x, this.game.camera.y + 420, 'Dialog_1');
        } else if (dialog == 2) {
            dialog_2 = this.game.add.sprite(this.game.camera.x, this.game.camera.y + 420, 'Dialog_2');
            
        } else if (dialog == 3) {
            the_end = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'The_End');
            
        } else if (dialog == 4) {
            romantic_music.stop();
            dialogs_animation_started = true;
            this.state.start('MainMenu');
        }
            number_of_dialog++;
    },

    Start_Animation: function() {

        player.body.velocity.x = 0;

        player.animations.stop();
        player.frame = 4;

        this.Play_SFX(1);

        enemy_one.y = 752;
        enemy_two.y = 752;

        enemy_one.x = 640;
        enemy_two.x = 610;
        
        enemy_one_direction = "right";
        enemy_two_direction = "right";

        enemy_one.animations.play('right');        
        enemy_two.animations.play('right');

        setTimeout(function(){
            player.frame = 0;            
            player.body.velocity.x = 10;
            player.animations.play('left');
        }, 1500);        

    },

    Second_Animation: function() {
        player.frame = 8;
        player.body.velocity.x = 30;
        player.animations.play('right');
    },

    Rulo_Animation: function() {
        var current = this;

        player.frame = 7;
        player.body.velocity.x = 0;
        player.animations.stop();

        rulo.frame = 1;
        
        rulo_animation_started = true;
        blank_animation_started = false;

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

    Dead_Enemies_Animation: function() {
        
        enemy_one_speed = -300;
        enemy_one.body.velocity.y = -300;
        enemy_one.body.velocity.x = -300;
        
        enemy_two_speed = -300;
        enemy_one.body.velocity.y = -300;
        enemy_two.body.velocity.x = -300;

        music.fadeOut(500);
        romantic_music.fadeIn(1000, true);
        rulo.frame = 0;

        dialogs_animation_started = false;
        this.Start_Dialogs(1);

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

    Set_Up_Player: function() {
        player = this.add.sprite(32, this.world.height - 300, 'karla');
        //player = this.add.sprite(1200, 740, 'karla');
        this.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.1;  

        player.animations.add('left', [0,1,2,3], 10, true);
        player.animations.add('right', [5,6,7,8], 10, true);
    },

    Set_Up_Rulo: function() {
        rulo = this.add.sprite(1426, 752, 'rulo');
        //player = this.add.sprite(32, 780, 'karla');
        this.physics.arcade.enable(rulo);
        rulo.body.collideWorldBounds = true;        
    },

    Set_Up_Enemies: function() {

        enemy_one = this.add.sprite(490,1520,'enemigo');
        enemy_two = this.add.sprite(700,1520,'enemigo'); 

	       

        this.physics.enable(enemy_one,Phaser.Physics.ARCADE);
        this.physics.enable(enemy_two,Phaser.Physics.ARCADE);        

        enemy_one.body.collideWorldBounds = true;
        enemy_two.body.collideWorldBounds = true;        

        enemy_one.anchor.setTo(0.5, 1);
        enemy_two.anchor.setTo(0.5, 1);   

	enemy_one_speed = 200;
	enemy_two_speed = 500;

	enemy_one_direction = "right";
	enemy_two_direction = "right";     

        enemy_one.animations.add('left', [0,1,2,3], 10, true)
        enemy_one.animations.add('right', [5,6,7,8], 10, true);
        enemy_two.animations.add('left', [0,1,2,3], 10, true)
        enemy_two.animations.add('right', [5,6,7,8], 10, true);        

        enemy_one.animations.play('right', 10, true);
        enemy_two.animations.play('left', 10, true);
        
    },

    Set_Up_World: function() {        
        this.world.setBounds(0,0,1600,1600);
        this.camera.y = this.world.height;        
    },

    Set_Up_Star: function() {
        star = this.add.sprite(62,1520,'star');
        this.physics.enable(star,Phaser.Physics.ARCADE);
    },

    Play_Background_Music: function() {
        music = this.add.audio('Level_4_Music');
        romantic_music = this.add.audio('Romantic_Music');
        music.fadeIn(1000, true);        
        //music.play(null, null, 0.5);
    },

    Move_Enemy: function() {

        enemy_one.body.velocity.x = enemy_one_speed;
        enemy_two.body.velocity.x = enemy_two_speed;              
    },

    checkForCliff: function (side, enemy) {
        var offsetX; //check tile ahead of sprite as opposed to right under
        if (side == "left")
            offsetX = -10;
        else if (side == "right")
            offsetX = 10;

        var tile = map.getTileWorldXY(enemy.body.x + offsetX, enemy.body.y + 50, 32, 32, platforms);
        
        if (enemy.body.blocked.down && tile == null)
            return true;
        else
            return false;
        
    },

    starCollect: function () {
        var number_of_memory = 4;
        star.kill();
        starCollected = true;
        music.stop();
        player.kill();
        
        this.state.start('Level_1');
    },

    Player_Hit: function () {
        
        this.GameOver();

    },    

    GameOver: function() {
        player.kill();
        enemy_one.kill();
        enemy_two.kill();
        
        enemy_one_speed = 200;
        enemy_two_speed = 500;
        
        enemy_one_direction = "right";
        enemy_two_direction = "right";
        music.fadeOut(1000);
        music.stop();
        this.state.start('Level_4');
    }


};
