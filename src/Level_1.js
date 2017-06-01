
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

var that;
var player;
var rulo;
var the_end;

var cursors;
var map;
var background;
var dialog = {};

var pictures = [];

var platforms;
var hurtSFX;
var music;
var boss_music;
var romantic_music;
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
    DISTANCIA_DIES: 9,
    RULO_THANKS_AGAIN: 10,
    RULO_LOVE_WORDS: 11,
    RULO_LOVE_WORDS_2: 12,
    RULO_PROPOSES: 13, 
    KARLA_ACCEPTS: 14,
    KARLA_REJECTS: 15
};

var blank;
var blank_counter = 0;
var blank_total_counter = 0;

var stars = [];
var stars_laser;
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
        that = this;
        this.Set_Up_Physics();
        this.Set_Up_World();
        this.Set_Up_Keys();
        this.Set_Up_Pictures();
        this.Set_Up_Player();
        this.Set_Up_Rulo();
        this.Set_Up_Blank_Screen();
        this.Play_Background_Music();
        //this.Set_Up_Distancia();        
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
        this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    Set_Up_Player: function() {
        
        var xOffset = 64;
        var yOffset = 110;

        var posInWorldX = (this.world.width/2) - xOffset;
        var posInWorldY = this.world.height - yOffset;

        player = this.add.sprite(posInWorldX, posInWorldY, 'karla');

        this.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.1;  
        player.anchor.setTo(0.5, 0.5);

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

        this.Distancia.sprite = this.add.sprite(posInWorldX, posInWorldY, 'distancia');

        this.physics.arcade.enable(this.Distancia.sprite);

        this.Distancia.sprite.body.collideWorldBounds = true;
        this.Distancia.sprite.body.bounce.y = 0.1;  

        this.Distancia.sprite.anchor.setTo(0.5,0.5);

        this.Distancia.sprite.animations.add('left', [0,1,2,3], 10, true);
        this.Distancia.sprite.animations.add('right', [5,6,7,8], 10, true);
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

    Set_Up_Credits: function() {
        if (!the_end)
            the_end = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'The_End');
    },

    //GamePlay
    current_animation_state: ANIMATION_STATES.RULO_THANKS,
    
    update: function () {

        this.Handle_Collisions();

        if (is_animation_playing) {
            this.Handle_Animations();

            if (this.Distancia.kill_animation_started) {
                player.body.velocity.x = 0;    
            }
            
            player.animations.stop();
            player.frame = 4;
        } else {
            this.Handle_Player_Actions();
            this.Handle_Camera_Movement();

            if (!animation_already_played) {
                this.Start_Animation();
            } else {
                this.Distancia.start_AI();
            }
        }        
    },

    Start_Animation: function() {
        is_animation_playing = true;
        animation_already_played = true;
        this.Set_Up_Dialog();    
    },

    Handle_Animations: function() {
        
        if (this.current_animation_state == ANIMATION_STATES.RULO_THANKS ||
            this.current_animation_state == ANIMATION_STATES.BEFORE_DISTANCIA_APPEARS ||
            this.current_animation_state == ANIMATION_STATES.KARLA_HESITATES ||
            this.current_animation_state == ANIMATION_STATES.RULO_CHEERS_KARLA ||
            this.current_animation_state == ANIMATION_STATES.KARLA_QUESTIONS_HERSELF ||
            this.current_animation_state == ANIMATION_STATES.KARLA_MOTIVATES ||
            this.current_animation_state == ANIMATION_STATES.DISTANCIA_DIES ||
            this.current_animation_state == ANIMATION_STATES.RULO_THANKS_AGAIN ||
            this.current_animation_state == ANIMATION_STATES.RULO_LOVE_WORDS ||
            this.current_animation_state == ANIMATION_STATES.RULO_LOVE_WORDS_2) {

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

        } else if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_APPEARS) {
            
            if (this.Distancia_Appears_Animation.has_ended && !dialog.enable_typing) {
                this.Handle_Animation_State_Transition();
            } else {
                this.Update_Dialog();
                this.Handle_Text_Update(); 
                this.Distancia.handle_distancia_appears_animation();                
            }

        } else if (this.current_animation_state == ANIMATION_STATES.RULO_PROPOSES) {
            
            this.Update_Dialog();
            this.Handle_Text_Update();             

            if (!dialog.enable_typing && !this.Propose_Animation.answer_has_been_selected) {
                this.Propose_Animation.show_answer_selection();
                this.Propose_Animation.check_user_input();
            } else if (!dialog.enable_typing && this.Propose_Animation.answer_has_been_selected) {

            }
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_ACCEPTS ||
                   this.current_animation_state == ANIMATION_STATES.KARLA_REJECTS) {

            this.Update_Dialog();
            this.Handle_Text_Update();

            if (!dialog.enable_typing && this.current_animation_state == ANIMATION_STATES.KARLA_ACCEPTS)  {
                this.Propose_Animation.celebrate();                       
            } else if (!dialog.enable_typing && this.current_animation_state == ANIMATION_STATES.KARLA_REJECTS) {
                this.Propose_Animation.rulo_explodes();
            }

            if (!dialog.enable_typing && this.Propose_Animation.game_over_timer <=0) {
                this.GameOver();
            }
        }
    },

    Handle_Animation_State_Transition: function() {

        if (animation_transition_counter <= 0) {

            if (this.current_animation_state == ANIMATION_STATES.KARLA_MOTIVATES) {
                is_animation_playing = false;
            }

            if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_DIES) {
                this.Distancia.clean();
                this.Propose_Animation.check_karla_direction();
            }
            
            this.current_animation_state++;

            if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_APPEARS ||
                this.current_animation_state == ANIMATION_STATES.RULO_THANKS_AGAIN ) {
                this.Play_Background_Music(this.current_animation_state);
            }

            animation_transition_counter = animation_transition_counter_time;
            this.Reset_Dialog();
        }

        dialog.final_string = '';
        animation_transition_counter--;
    },

    Reset_Dialog: function() {
        dialog.current_string = '';
        dialog.final_string_index = 0;
        dialog.type_timeout = 0;
        dialog.enable_typing = true;
        dialog.text.setText('');
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
                    rulo.scale.x = 1;
                    this.has_ended = true;
                }
                
            }
            
        }
    },

    Distancia: {
        is_damaged: false,
        jump_timer: 0,        
        walking_speed: 90,
        damage_cooldown: 100,
        damage_cooldown_timer: 0,
        kill_cooldown_timer: 110,
        hit_points: 3,
        kill_animation_started: false,
        resume_animation_timeout: 130,

        handle_distancia_appears_animation: function() {
            if (!that.Distancia_Appears_Animation.distancia_has_appeared) {
                that.Set_Up_Distancia();
                that.Distancia_Appears_Animation.distancia_has_appeared = true;
            }
            that.Distancia_Appears_Animation.blow_characters();
            
        },

        move_left: function() {
            this.sprite.body.velocity.x = -this.walking_speed;
            this.sprite.animations.play('left');
        },

        move_right: function() {
            this.sprite.body.velocity.x = this.walking_speed;
            this.sprite.animations.play('right');
        },

        stop_moving: function() {
            this.sprite.body.velocity.x = 0;
            this.sprite.animations.stop();
            this.sprite.frame = 4;
        },

        jump: function() {
            if (this.sprite.body.blocked.down && (that.time.now > this.jump_timer)) {
                this.sprite.body.velocity.y = -280;
                this.jump_timer = that.time.now + 750;
            }
        },

        start_AI: function() {

            if (this.hit_points > 0) {
                this.chase_player();
                this.jump();
                this.check_damage();
            } else {
                
                this.stop_moving();

                if (this.kill_cooldown_timer >= 0) {
                    this.kill_cooldown_timer--;
                } else {
                    this.kill();
                    this.resume_animation();    
                }
            }
        },

        resume_animation: function() {

            if (this.resume_animation_timeout >= 0) {
                this.resume_animation_timeout--;
            } else {
                is_animation_playing = true;
            }
        },

        check_damage: function() {

            if (this.is_damaged && this.damage_cooldown_timer >= 0) {
                this.damage_cooldown_timer--;
            } else {
                this.damage_cooldown_timer = this.damage_cooldown;
                this.is_damaged = false;
            }            
        },

        chase_player: function() {
            
            var player_direction = player.position.x < this.sprite.position.x ? 'left':'right';
            var position_offset = 10;
            var max_player_zone = player.position.x + position_offset;
            var min_player_zone = player.position.x - position_offset;
            
            var is_in_player_zone = this.sprite.position.x >= min_player_zone && this.sprite.position.x <= max_player_zone;

            if (!is_in_player_zone && player_direction === 'left') {
                this.move_left();
            } else if (!is_in_player_zone && player_direction === 'right') {
                this.move_right();
            } else {
                this.stop_moving();
            }
        },

        damage: function() {
            this.is_damaged = true;
            this.damage_cooldown_timer = this.damage_cooldown;
            this.hit_points--;
            this.play_kill_SFX();
        },

        kill: function() {

            if (!this.kill_animation_started) {
                this.kill_animation_started = true;
                this.damage_cooldown_timer = this.damage_cooldown;                
                this.play_kill_animation();
            }     
        },

        play_kill_SFX: function(is_after_explotion) {

            if (is_after_explotion) {
                var after_explotion = that.add.audio('after_explotion');
                after_explotion.play();    
            } else {
                var kill_explotion = that.add.audio('kill_explotion');
                kill_explotion.play();    
            }
            
        },

        play_kill_animation: function() {
            this.set_up_fire();
            this.fire.animations.play('burn');
            this.play_kill_SFX(true);            
        },

        set_up_fire: function(){
            var xOffset = 0;
            var yOffset = 0;

            var posInWorldX = this.sprite.position.x - xOffset;
            var posInWorldY = this.sprite.position.y - yOffset;

            this.fire = that.add.sprite(posInWorldX, posInWorldY, 'fire');

            that.physics.arcade.enable(this.fire);

            this.fire.body.collideWorldBounds = true;
            this.fire.body.bounce.y = 0.1;  
            this.fire.anchor.setTo(0.5, 0.5);

            this.fire.animations.add('burn', [0,1,2], 3, true);
        },

        clean: function() {
            if (this.fire)
                this.fire.destroy();
            if (this.sprite)
                this.sprite.destroy();
        }
    },

    Propose_Animation: {
        answer_has_been_selected: false,
        dance_timer: 500,
        dance_started: false,
        rulo_explodes_started: false,
        explodes_timer: 300,
        game_over_timer: 800,

        celebrate: function() {

            if (this.dance_timer > 0 && !this.dance_started) {
                
                that.Play_Background_Music(that.current_animation_state);
                this.dance_started = true;    
            } else if (this.dance_timer <= 0) {
                that.Set_Up_Credits();
                return false;
            }
            
            this.everyone_dances();
            this.dance_timer--;
            this.game_over_timer--;
        },

        rulo_explodes: function() {

            if (this.explodes_timer > 0 && !this.rulo_explodes_started) {
                this.rulo_explodes_started = true;                
                this.play_kill_animation();
            }  else if (this.explodes_timer <= 0) {
                that.Set_Up_Credits();
                return false;
            }    
            this.explodes_timer--;
            this.game_over_timer--;
        },

        play_kill_SFX: function() {
            var after_explotion = that.add.audio('after_explotion');
            after_explotion.play();                
        },

        play_kill_animation: function() {
            this.set_up_fire();
            this.fire.animations.play('burn');
            this.play_kill_SFX();            
        },

        set_up_fire: function(){
            var xOffset = 0;
            var yOffset = 0;

            var posInWorldX = rulo.position.x - xOffset;
            var posInWorldY = rulo.position.y - yOffset;

            this.fire = that.add.sprite(posInWorldX, posInWorldY, 'fire');

            that.physics.arcade.enable(this.fire);

            this.fire.body.collideWorldBounds = true;
            this.fire.body.bounce.y = 0.1;  
            this.fire.anchor.setTo(0.5, 0.5);            

            this.fire.animations.add('burn', [0,1,2], 3, true);
        },

        check_karla_direction: function() {            
            
            if (player.position.x < rulo.position.x) {
                rulo.scale.x = 1;
            } else {
                rulo.scale.x = -1;
            } 
        },

        set_up_ring: function() {
            var xOffset= 0;
            var yOffset= - (rulo.height/2 + 10);
            var posX = rulo.position.x + xOffset;
            var posY = rulo.position.y + yOffset;

            this.ring = that.add.sprite(posX, posY, 'ring');
            this.ring.anchor.setTo(0.5, 0.5);
        },

        show_answer_selection: function() {
            if (!this.ring) {
                rulo.frame = 1;
                this.set_up_ring();
            }

            rulo.frame = 1;

            if (!this.answers) {
                var xOffset = 0;
                var yOffset = 40;

                var posInWorldX = that.world.width/2 + xOffset;
                var posInWorldY = that.world.height - yOffset;
                
                this.answers = that.add.text(posInWorldX, posInWorldY, 'SI              NO', {
                    font: '20px Arial',
                    fill: '#ffffff',
                    align: 'center'
                });

                this.selectorFirstPosX = (that.world.width/2) - 45;
                this.selectorSecondPosX = that.world.width/2  + 55;
                this.selectorPosY = that.world.height - 45;

                this.selector = that.add.sprite(this.selectorFirstPosX, this.selectorPosY, 'diamond');
            }                
        },

        check_user_input: function() {

            if (cursors.left.isDown && this.selector) {
                this.selector.x = this.selectorFirstPosX;
            } else if (cursors.right.isDown && this.selector) {
                this.selector.x = this.selectorSecondPosX;                
            } else if (that.spaceBar.isDown && this.selector) {
                                
                if (this.selector.x == this.selectorFirstPosX) {                
                    that.current_animation_state = ANIMATION_STATES.KARLA_ACCEPTS;
                } else {                    
                    that.current_animation_state = ANIMATION_STATES.KARLA_REJECTS;
                }
                that.Reset_Dialog();
                this.answers.destroy();
                this.selector.destroy(); 
            }
        },

        everyone_dances: function() {
            if (that.time.now%10 == 0) {
                player.scale.x *= -1;
                rulo.scale.x *= -1;
            }
        }
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
            dialog.final_string = 'Rulo: Muchas gracias mi karlita hermosa por estar conmigo todos estos años...';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_SEARCHING_FOR_DIAMOND_TEXT) {
            dialog.final_string = 'Rulo: Tu sabes que te amo y yo.... ?????????.........\n¿¡¿¡Qui\én anda ahi??!?!....';
        } else if (this.current_animation_state == ANIMATION_STATES.BEFORE_DISTANCIA_APPEARS) {
            dialog.final_string = '???: BUAHAHAHAHAHAH!';
        } else if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_APPEARS) {
            dialog.final_string = 'Distancia: ¡¡¡Soy la Diosa Distancia!!! \n He venido a llevarme a Rulo, para que nunca sean felices!';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_HESITATES) {
            dialog.final_string = 'Karla: Oh no...... creo que ella es demasiado para mi....\n no voy a poder hacerlo....';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_CHEERS_KARLA) {
            dialog.final_string = 'Rulo: ¡Animo Karla! Yo se que eres una persona genial y que puedes hacer todo.....\n solo... tienes que vencerte a ti misma y confiar en nosotros....';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_QUESTIONS_HERSELF) {
            dialog.final_string = 'Karla: Vencerme a mi misma.......... y confiar...................';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_MOTIVATES) {
            dialog.final_string = 'Karla: ¡Muy bien, Yo se que puedo! ¡¡¡¡¡¡¡¡Te derrotare Distancia!!!!!!!!!!!!!!!';
        } else if (this.current_animation_state == ANIMATION_STATES.DISTANCIA_DIES) {
            dialog.final_string = 'Distancia: NOOOOOOOOOOOOOOOOOO';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_THANKS_AGAIN) {
            dialog.final_string = 'Rulo: ¡Sabia que podias! ¡Eres la mejor! Pero ahora.....\n Te quiero decir algo muy importante...';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_LOVE_WORDS) {
            dialog.final_string = 'Rulo: Tu eres lo que mas quiero y adoro....\n me gustas con tus virtudes y tus defectos y de verdad...\n ';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_LOVE_WORDS_2) {
            dialog.final_string = 'Rulo: ¡Creo que tendremos una aventura genial! Asi que.......';
        } else if (this.current_animation_state == ANIMATION_STATES.RULO_PROPOSES) {
            dialog.final_string = 'Rulo: ¿Te quieres casar conmigo? ';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_ACCEPTS) {
            dialog.final_string = 'Rulo: ¡¡¡Siiiiiiiiiiiiiiiiiiiiiiiiiii!!!!';
        } else if (this.current_animation_state == ANIMATION_STATES.KARLA_REJECTS) {
            dialog.final_string = 'Rulo: NOOOO, Me muerooooooo';
        }
    },

    Handle_Collisions: function() {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(rulo, platforms);

        if (this.Distancia.sprite) {
            this.physics.arcade.collide(this.Distancia.sprite, platforms);    
        }
        
        if (this.Distancia.fire) {
            that.physics.arcade.collide(this.Distancia.fire, platforms);
        }

        if (this.Propose_Animation.fire) {
            that.physics.arcade.collide(this.Propose_Animation.fire, platforms);
        }
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
        
        if (this.spaceBar.isDown && enableStarPower && (stars.length < max_star_number)) {
            if (!stars_laser) {
                stars_laser = this.add.audio('stars_laser');
            }
            stars_laser.play();
            this.Create_New_Star_Bullet();
        }

        this.Check_Star_List();
        starPowerCooldown--;
    },

    Create_New_Star_Bullet : function() {

        var that = this;
        var star = new small_star_power();
        var star_offset_x = 0;
        var star_offset_y = 0;

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

            
            if (this.Check_Overlap(this.Distancia.sprite, current_star.sprite) && !this.Distancia.is_damaged) {
                
                this.Distancia.damage();
                current_star.sprite.destroy();
                stars.splice(index, 1);
            }
            

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
        } else if (sfx == ANIMATION_STATES.KARLA_MOTIVATES) {
            boss_battle = this.add.audio('magic');
            magic.play();
        }
    },

    Play_Background_Music: function(music_type) {
       
        //romantic_music = this.add.audio('Romantic_Music');
        if (music_type == ANIMATION_STATES.RULO_THANKS_AGAIN){
            romantic_music = this.add.audio('Romantic_Music');
            if (boss_music)
                boss_music.fadeTo(2000, 0);
            //boss_music.pause();
            romantic_music.play(null, null, 0, true, null);
            romantic_music.fadeIn(1500,true);
        } else if (music_type == ANIMATION_STATES.DISTANCIA_APPEARS){
            boss_music = this.add.audio('Boss_Music');
            music.fadeOut(1000,true);
            //music.pause();
            boss_music.play(null, null, 0, true, null);
            boss_music.fadeTo(1000, 0.6);
        }  else if (music_type == ANIMATION_STATES.KARLA_ACCEPTS){
            victory_music = this.add.audio('Victory_Music');

            if (romantic_music)
                romantic_music.fadeOut(1000,true);
            if (music)
                music.fadeOut(1000,true);
            //music.pause();
            victory_music.play(null, null, 0, false, null);
            victory_music.fadeTo(1000, 0.6);
        } else {
            //music.fadeIn(1000, true);
            music = this.add.audio('Level_1_Music');
            music.play();
        }
        //music.play(null, null, 0.5);
    },

    GameOver: function() {
        player.kill();
        rulo.kill();        

        romantic_music.fadeOut(1000);
        romantic_music.stop();

        music.fadeOut(1000);
        music.stop();


        this.state.start('MainMenu');
    }
};
