
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
var distancia;

var cursors;
var map;
var background;
var dialog = {};

var pictures = [];

var platforms;
var hurtSFX;
var music;
var jumpTimer = 0;

var is_animation_playing = false;
var animation_already_played = false;
var blank_animation_started = false;
var blank_animation_ended = false;
var blank_animation_flash_delay = 15;
var animation_transition_counter_time = 110;
var animation_transition_counter = animation_transition_counter_time;
var wait_timer = 0;

var ANIMATION_STATES = {
    RULO_THANKS: 0,
    RULO_SEARCHING_FOR_DIAMOND_TEXT: 1,
    PLAY_BLANK_ANIMATION: 2,
    BEFORE_DISTANCIA_APPEARS: 3,
    DISTANCIA_APPEARS: 4,
    KARLA_HESITATES: 5,
    RULO_CHEERS_KARLA: 6,
    KARLA_QUESTIONS_HERSELF: 7,
    KARLA_MOTIVATES: 8,

};

var blank;
var blank_counter = 0;
var blank_total_counter = 0;

var stars = [];
var max_star_number = 3;
var starPowerCooldown = 0;

var small_star_power = function() {
    this.posX = 0;
    this.posY= 0;
    this.speedX= 10;
    this.speedY= 100;
    this.timeout= 0;
    this.lifespan = 100;
    this.cooldown = 10;
};

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
        this.Play_Background_Music();
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

        var xOffset = 0;
        var yOffset = 110;

        var posInWorldX = (this.world.width/2) - xOffset;
        var posInWorldY = this.world.height - yOffset;

        rulo = this.add.sprite(posInWorldX, posInWorldY, 'rulo');

        this.physics.arcade.enable(rulo);
        rulo.body.collideWorldBounds = true;     
        rulo.anchor.setTo(0.5,0.5);

        rulo.frame = 0;   
    },

    Set_Up_Distancia: function() {
        
        var xOffset = 32;
        var yOffset = 145;

        var posInWorldX = rulo.position.x - xOffset;
        var posInWorldY = this.world.height - yOffset;

        distancia = this.add.sprite(posInWorldX, posInWorldY, 'distancia');

        this.physics.arcade.enable(distancia);

        distancia.body.collideWorldBounds = true;
        distancia.body.bounce.y = 0.1;  

        distancia.animations.add('left', [0,1,2,3], 10, true);
        distancia.animations.add('right', [5,6,7,8], 10, true);
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

    Set_Up_Dialog: function() {
        var xOffset = 64;
        var yOffset = 80;

        var posInWorldX = this.camera.x + xOffset;
        var posInWorldY = this.world.height - yOffset;
        
        dialog.text = this.add.text(posInWorldX, posInWorldY, '', {
            font: '20px Arial',
            fill: '#ffffff',
            align: 'center'
        });

        dialog.velocity = 2;
        dialog.current_string = '';
        dialog.final_string_index = 0;
        dialog.type_timeout = 0;
        dialog.enable_typing = true;
    },

    //GamePlay
    current_animation_state: ANIMATION_STATES.RULO_THANKS,
    
    update: function () {

        this.Handle_Collisions();

        if (is_animation_playing) {
             this.Handle_Animations();
        } else {
            this.Handle_Player_Actions();
            this.Handle_Camera_Movement();
            this.Start_Animation();
        }        
    },

    Start_Animation: function() {

        if(!animation_already_played){
            is_animation_playing = true;
            animation_already_played = true;
            this.Set_Up_Dialog();  
        }
    },

    Handle_Animations: function() {
        
        if (this.current_animation_state == ANIMATION_STATES.RULO_THANKS ||
            this.current_animation_state == ANIMATION_STATES.BEFORE_DISTANCIA_APPEARS ||
            this.current_animation_state == ANIMATION_STATES.KARLA_HESITATES ||
            this.current_animation_state == ANIMATION_STATES.RULO_CHEERS_KARLA ||
            this.current_animation_state == ANIMATION_STATES.KARLA_QUESTIONS_HERSELF ||
            this.current_animation_state == ANIMATION_STATES.KARLA_MOTIVATES) {

            this.Update_Dialog();
            this.Handle_Text_Update(); 

            if (!dialog.enable_typing) {
                this.Handle_Animation_State_Transition();
            }

        } else if (this.current_animation_state == ANIMATION_STATES.RULO_SEARCHING_FOR_DIAMOND_TEXT) {

            this.Update_Dialog();
            this.Handle_Text_Update(); 
            if (!dialog.enable_typing) {
                rulo.scale.x = -1;
                this.Handle_Animation_State_Transition();
            }

        } else if (this.current_animation_state == ANIMATION_STATES.PLAY_BLANK_ANIMATION) {

            if (blank_animation_ended) {
                this.Handle_Animation_State_Transition();
            } else {
                this.Handle_Blank_Animation();    
            }

        }  else if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_APPEARS) {
            
            if (this.Distancia_Appears_Animation.has_ended && !dialog.enable_typing) {
                this.Handle_Animation_State_Transition();
            } else {
                this.Update_Dialog();
                this.Handle_Text_Update(); 
                this.Handle_Distancia_Appears_Animation();                
            }
        }
    },

    Distancia_Appears_Animation: {
        distancia_has_appeared: false,
        has_ended: false,
        time_of_character_blowing : 80,
        time_blowing: 0,
        impact_force: 100,        
        blow_characters: function(){
            
            if (this.time_blowing <= this.time_of_character_blowing) {
                player.body.velocity.x = -this.impact_force;
                player.body.velocity.y = -this.impact_force;
                rulo.body.velocity.x = this.impact_force;
                rulo.body.velocity.y = -this.impact_force;
                this.time_blowing++;
                
            } else {
                
                if (rulo.body.velocity.x >= 0) {
                    player.body.velocity.x++;
                    player.body.velocity.y++;
                    rulo.body.velocity.x--;
                    rulo.body.velocity.y++;
                    this.fall_time--;
                } else {
                    this.has_ended = true;
                }
                
            }
            
        }
    },

    Handle_Distancia_Appears_Animation: function() {
        if (!this.Distancia_Appears_Animation.distancia_has_appeared) {
            this.Set_Up_Distancia();
            this.Distancia_Appears_Animation.distancia_has_appeared = true;
        }
        this.Distancia_Appears_Animation.blow_characters();
        
    },

    Handle_Blank_Animation: function() {

        if (!blank_animation_started) {
            blank_animation_started = true;
            this.Play_SFX(ANIMATION_STATES.PLAY_BLANK_ANIMATION);
        }

        blank.x = this.camera.x;
        blank.y = this.camera.y;

        blank.alpha = blank_total_counter%2 === 0 ? 0:1;

        blank_total_counter++;

        if (blank_total_counter > blank_animation_flash_delay) {
            blank_animation_ended = true;
            blank.alpha = 0;
        }
    },

    Handle_Text_Update: function() {

        if (dialog.enable_typing) {

            if (dialog.type_timeout > dialog.velocity) {

                dialog.text.setText(dialog.current_string += dialog.final_string[dialog.final_string_index]);
                dialog.type_timeout = 0;

                if (dialog.current_string.length != dialog.final_string.length) {
                    dialog.final_string_index++;
                } else {
                    dialog.enable_typing = false;
                }
            }
            dialog.type_timeout++; 
        }
    },

    Update_Dialog: function() {
        if (this.current_animation_state == ANIMATION_STATES.RULO_THANKS) {
            dialog.final_string = 'Rulo: Muchas gracias mi karlita hermosa por rescatarme todos estos años...';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_SEARCHING_FOR_DIAMOND_TEXT) {
            dialog.final_string = 'Rulo: Tengo que pagarte de alguna forma..................\n¿Qu\é es eso que brilla?....';
        } else if (this.current_animation_state == ANIMATION_STATES.BEFORE_DISTANCIA_APPEARS) {
            dialog.final_string = '???: BUAHAHAHAHAHAH!';
        } else if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_APPEARS) {
            dialog.final_string = 'Distancia: ¡¡¡Soy la Diosa Distancia!!! \n He venido a llevarme a Rulo, para que nunca sean felices!';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_HESITATES) {
            dialog.final_string = 'Karla: Oh no...... creo que ella es demasiado enemigo para mi....\n no voy a poder hacerlo....';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_CHEERS_KARLA) {
            dialog.final_string = 'Rulo: ¡Animo Karla! Yo se que eres una persona genial y que puedes hacer todo.....\n solo... tienes que vencerte a ti misma';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_QUESTIONS_HERSELF) {
            dialog.final_string = 'Karla: Vencerme a mi misma...................';
        }  else if (this.current_animation_state == ANIMATION_STATES.KARLA_MOTIVATES) {
            dialog.final_string = 'Karla: ¡Muy bien, Yo se que puedo! Y te derrotare Distancia';
        }
    },

    Handle_Animation_State_Transition: function() {

        if (animation_transition_counter <= 0) {
            this.current_animation_state++;

            dialog.current_string = '';
            dialog.final_string_index = 0;
            dialog.type_timeout = 0;
            dialog.enable_typing = true;
            animation_transition_counter = animation_transition_counter_time;
            dialog.text.setText('');
        }
        dialog.final_string = '';
        animation_transition_counter--;
    },

    Handle_Collisions: function() {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(rulo, platforms);
        this.physics.arcade.collide(distancia, platforms);
    },

    Handle_Player_Actions: function() {
        this.Handle_Player_Movement();
        this.Handle_Player_Attack();
    },

    Handle_Player_Movement: function() {
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
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
    },

    Handle_Player_Attack: function() {
        if (starPowerCooldown <= 0) {
            enableStarPower = true;
        }
        
        if (this.zKey.isDown && enableStarPower && (stars.length < max_star_number)) {
            this.Create_New_Star_Bullet();
        }

        this.Check_Star_List();
        starPowerCooldown--;
    },

    Create_New_Star_Bullet : function() {

        var that = this;
        var star = new small_star_power();
        var star_offset_x = player.width/2;
        var star_offset_y = player.height/2;

        var star_position_x =  player.position.x + star_offset_x;
        var star_position_y =  player.position.y + star_offset_y;

        star.sprite = that.add.sprite(star_position_x, star_position_y,'star');
        star.sprite.scale.setTo(0.5, 0.5); 

        if (cursors.left.isDown) {
            star.speedX = -star.speedX;
        }

        stars.push(star);
        starPowerCooldown = star.cooldown;
        enableStarPower = false;
    },

    Check_Overlap: function(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    Check_Star_List: function() {

        for (var index = 0; index < stars.length; index++) {
            var current_star = stars[index];
            current_star.timeout++;
            current_star.sprite.position.x += current_star.speedX;

            /*
            if (this.Check_Overlap(rulo, current_star.sprite)) {
                current_star.sprite.destroy();
                stars.splice(index, 1);
            }
            */

            if (current_star.timeout >= current_star.lifespan) {
                current_star.sprite.destroy();
                stars.splice(index, 1);
            }
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

    Play_SFX: function(sfx) {
        if (sfx == 1) {
            noise = this.add.audio('enemy_sound');
            noise.play();

        } else if (sfx == ANIMATION_STATES.PLAY_BLANK_ANIMATION) {
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
