// Declare some global variables/functions that we'll be using

var angleConfig = {
    min: 0, max: 360
};
var speedConfig = {
    min: 0, max: 200
};
var scaleConfig = {
    start: 1, end: 0, ease: 'Linear'
};
var alphaConfig = {
    start: 1, end: 0, ease: 'Linear'
};


function compare(player_score_1, player_score_2) {
    if (player_score_1[1] > player_score_2[1]) {
        return -1;
    } else if (player_score_1[1] < player_score_2[1]) {
        return 1;
    } else {
        return 0;
    }
}

function distanceFromNearestPlayer(x, y, players) {
    var closestDist = null;
    var closestSpot = null;
    for (player of players) {
        curDist = distance(player.x, player.y, x, y);
        if (closestDist == null || curDist < closestDist) {
            closestDist = curDist;
            closestSpot = {"x": x, "y": y};
        }
    }
    return closestDist;
}

function findBestSpawnPoint(map_width, map_height, existing_players) {
    var bestSpot = {"x": map_width/2, "y": map_height/2};
    var furthestDistance = -1;
    var curDist;

    for (var i = Math.floor(Math.random() * 999) + 1; i < map_width; i += 1000) {
        for (var j = Math.floor(Math.random() * 999) + 1; j < map_height; j += 1000) {
            curDist = distanceFromNearestPlayer(i, j, existing_players);
            if (curDist != null && curDist > furthestDistance) {
                bestSpot = {"x": i, "y": j};
                furthestDistance = curDist;
            }
        }
    }

    return bestSpot;
}

function pickRandomPlayerType() {
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'][Math.floor(Math.random() * 5)]
}




/* Define UIScene class, which will be responsible for overlaying UI elements on the screen
 * such as a high scores table, a text box to enter one's name, and a "You Lose!" text object.
 */
var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    },

    preload: function() {
        this.load.html('scores', 'assets/scores.html');
        this.load.css('highscores_css', 'assets/myTable.css');
    },

    create: function ()
    {
        //  Grab a reference to the Game Scene
        var ourGame = gameScene;
        var uiScene = this;

        var scoresTable = this.add.dom(0, 0).createFromCache('scores');
        scoresTable.setOrigin(0);
        scoresTable.x += window.innerWidth - scoresTable.width - 100;
        scoresTable.y += 20;
        this.scoresTable = scoresTable;

        uiScene.text = uiScene.add.text(window.innerWidth/2, window.innerHeight/2-100, 'You lose!',
                                           {align: 'center', color: 'white', fontSize: '64px'}).setOrigin(0.5);
        uiScene.text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        uiScene.text.setDepth(100);
        uiScene.text.setVisible(false);


        var nameBox = this.add.dom(0, 0).createFromHTML('<input type="text" name="nameField" placeholder="Enter your name" size="15" style="font-size: 32px;">'+
                                                        '<input type="button" name="playButton" value="Let\'s Play" style="font-size: 32px">');

        this.nameBox = nameBox;
        nameBox.x = window.innerWidth/2;
        nameBox.y = window.innerHeight/2;

        nameBox.addListener('click');

        scene = gameScene;
        var uiScene = this;

        nameBox.on('click', function (event) {

            if (event.target.name === 'playButton')
            {
                var inputText = this.getChildByName('nameField');

                //  Have they entered anything?
                if (inputText.value !== '')
                {

                    this.setVisible(false);
                    uiScene.text.setVisible(false);

                    var spawnPoint = findBestSpawnPoint(10000, 10000, scene.players.children.entries);
                    let player = new MainPlayer({scene:scene,x:spawnPoint.x,y:spawnPoint.y,size:1,acceleration:3500,maxSpeed:400,type:pickRandomPlayerType(), name:inputText.value});
                    scene.players.add(player);
                    scene.cameras.main.setZoom(1);
                    scene.cameras.main.startFollow(player);
                    player.body.collideWorldBounds = true;
                }
            }
        });
    }

});



/* Define our main scene class, which will be responsible for all of the core gameplay. */
var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene()
    {
        Phaser.Scene.call(this, { key: 'GameScene', active: true });
    },

    preload: function()
    {
        this.load.image('food', 'assets/SVG/sign-air.svg');
        this.load.image('water', 'assets/SVG/sign-water.svg');
        this.load.image('rock', 'assets/Rock_120x121.png');
        this.load.image('paper', 'assets/Paper_120x119.png');
        this.load.image('scissors', 'assets/Scissors_120x120.png');
        this.load.image('lizard', 'assets/Lizard_120x119.png');
        this.load.image('spock', 'assets/Spock_120x120.png');

        this.load.html('scores', 'assets/scores.html');
        this.load.css('highscores_css', 'assets/myTable.css');
        this.load.text('names', 'assets/names.txt');
        this.load.image('spark1', 'assets/smoke.png');
    },

    create: function()
    {
        // The maximum number of players
        this.maxPlayers = 100;

        // create a collision group for player circles
        this.players = this.physics.add.group({
            bounceX: 0.5,
            bounceY: 0.5,
        });

        // create a collision group for food circles
        this.food = this.physics.add.group({
        });

        // Set the world bounds as a rectangle that starts at (0, 0) and has a width and height
        this.physics.world.setBounds(0, 0, 10000, 10000);

        // Create a map area that has the same position and size as the world bounds. The
        // map area is essentially a grid overlay, but it also handles spawning food
        this.map = new MapArea({scene:this, x:0, y:0, sizeX:10000, sizeY:10000, color:'blue'});

        // On an interval, check if AI Players need to be spawned
        this.spawnAIPlayers();
        var timedEvent = this.time.addEvent({ delay: 5000, callback: this.spawnAIPlayers, callbackScope: this, loop: true});

        // set up functions that should be run when players collide with each other or food
        this.physics.add.overlap(this.players, this.food, this.transformPlayerType, null, this);
        this.physics.add.overlap(this.players, this.players, this.playerCollision, null, this);

        this.cameras.main.setBackgroundColor(0x000000);
        this.cameras.main.setZoom(0.075);
        this.cameras.main.centerOn(5000, 5000)
    },


    update: function()
    {
        // Run each player's update function, and fetch each player's score.
        var scores = [];
        for (player of this.players.children.entries) {
            player.update();
            scores.push([player.name, player.score]);
        }

        // Sort the scores of each player from highest to lowest
        scores.sort(compare);

        // Update the high scores table
        var highScoresTable = uiScene.scoresTable;
        var childElements = highScoresTable.node.children[2].tBodies[0].children;
        for (var i = 0; i < childElements.length && i < scores.length; i += 1) {
            childElements[i].children[0].innerText = scores[i][0];
            childElements[i].children[1].innerText = scores[i][1];
        }
    },

    playerCollision: function(player_1, player_2) {
        var mapping = {'rock': ['scissors', 'lizard'],
                       'paper': ['rock', 'spock'],
                       'scissors': ['paper', 'lizard'],
                       'lizard': ['spock', 'paper'],
                       'spock': ['scissors', 'rock']
                      }
        var player_1_type = player_1.player_type;
        var player_2_type = player_2.player_type;
        var player_to_destroy;
        if (mapping[player_1_type].includes(player_2_type)) {
            player_to_destroy = player_2;
            player_1.score += 1;
        } else if (mapping[player_2_type].includes(player_1_type)) {
            player_to_destroy = player_1;
            player_2.score += 1;
        }

        if (player_to_destroy) {

            if (player_to_destroy.constructor.name == 'MainPlayer') {

                uiScene.nameBox.setVisible(true);
                uiScene.text.setVisible(true);
                
                var tween = this.tweens.add({
                    targets: uiScene.text,
                    alpha: { from: 0, to: 1 },
                    // alpha: { start: 0, to: 1 },
                    // alpha: 1,
                    // alpha: '+=1',
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 1000,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                });
            }

            this.emitter = this.add.particles(player_to_destroy.player_type).createEmitter({
                name: 'sparks',
                x: player_to_destroy.x,
                y: player_to_destroy.y,
                gravityY: 300,
                speed: speedConfig,
                angle: angleConfig,
                scale: scaleConfig,
                alpha: alphaConfig,
                blendMode: 'SCREEN',
                lifespan: 1000
            });
            this.emitter.explode(5);
            player_to_destroy.destroy();
        }
    },

    getRandomBotName: function() {
        var names = this.cache.text.get('names').split("\n");
        return "bot_" + names[Math.floor(Math.random() * names.length)].toLowerCase();
    },

    spawnAIPlayers: function() {
        var totalPlayers = this.players.children.entries.length;
        for (var i = totalPlayers; i < this.maxPlayers; i+=1) {
            var image = pickRandomPlayerType();
            var spawnPoint = findBestSpawnPoint(10000, 10000, this.players.children.entries);
            let enemy = new AIPlayer({scene:this,x:spawnPoint.x,y:spawnPoint.y,size:1, acceleration:1400, maxSpeed:350, type:image, name: this.getRandomBotName()});
            this.players.add(enemy);
            enemy.body.collideWorldBounds = true;
        }
    },

    transformPlayerType: function(player, food) {
        player.update_type(pickRandomPlayerType());
        food.destroy();
    }
});



// Create our UIScene and GameScene
let uiScene = new UIScene();
let gameScene = new GameScene();

// Create our Game
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',

    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        },
    },
    scene: [ gameScene, uiScene ],
    dom: {
        createContainer: true
    },
};
var game = new Phaser.Game(config);
