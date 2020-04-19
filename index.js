// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');

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

gameScene.preload = function()
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
}

gameScene.create = function()
{
    // The maximum number of players
    this.maxPlayers = 150;

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

    // Display the menu (which is basically just a text box asking for your name)
    this.showMenuScene(5000, 5000);
}

function compare(player_score_1, player_score_2) {
    if (player_score_1[1] > player_score_2[1]) {
        return -1;
    } else if (player_score_1[1] < player_score_2[1]) {
        return 1;
    } else {
        return 0;
    }
}

gameScene.update = function()
{
    // Run each player's update function
    var scores = [];
    for (player of this.players.children.entries) {
        player.update();
        scores.push([player.name, player.score]);
    }

    scores.sort(compare);

    var highScoresTable = uiScene.element;

    var childElements = highScoresTable.node.children[2].tBodies[0].children;
    for (var i = 0; i < childElements.length && i < scores.length; i += 1) {
        childElements[i].children[0].innerText = scores[i][0];
        childElements[i].children[1].innerText = scores[i][1];
    }
}

gameScene.showMenuScene = function(x, y) {
    // Make the camera follow the player

    var scene = this;
    var element = scene.add.dom(x, y).createFromHTML('<input type="text" name="nameField" placeholder="Enter your name" size="15" style="font-size: 32px;">'+
                                                           '<input type="button" name="playButton" value="Let\'s Play" style="font-size: 32px">');
    element.originX = 0;
    element.originY = 0;

    element.setScale(1/scene.cameras.main.zoom);
    element.x = x - element.width*element.scale/2;
    element.y = y - element.height*element.scale/2;

    element.addListener('click');

    scene.cameras.main.startFollow(element,null,null,null,-element.width*element.scale/2, -element.height*element.scale/2);

    element.on('click', function (event) {

        if (event.target.name === 'playButton')
        {
            var inputText = this.getChildByName('nameField');

            //  Have they entered anything?
            if (inputText.value !== '')
            {
                //  Turn off the click events
                this.removeListener('click');

                this.setVisible(false);

                //  Populate the text with whatever they typed in
                // create player circlej
                if (scene.text) {
                    scene.text.setVisible(false);
                }
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

var distance = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
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
    return ['rock', 'paper', 'scissors', 'lizard', 'spock'][Math.floor(Math.random() * 4) + 1]
}

gameScene.getRandomBotName = function() {
    var names = this.cache.text.get('names').split("\n");
    return "bot_" + names[Math.floor(Math.random() * names.length)].toLowerCase();
}

gameScene.spawnAIPlayers = function() {
    var totalPlayers = this.players.children.entries.length;
    for (var i = totalPlayers; i < this.maxPlayers; i+=1) {
        var image = pickRandomPlayerType();
        var spawnPoint = findBestSpawnPoint(10000, 10000, this.players.children.entries);
        let enemy = new AIPlayer({scene:this,x:spawnPoint.x,y:spawnPoint.y,size:1, acceleration:1400, maxSpeed:350, type:image, name: this.getRandomBotName()});
        this.players.add(enemy);
        enemy.body.collideWorldBounds = true;
    }
}

gameScene.transformPlayerType = function(player, food) {
    player.update_type(pickRandomPlayerType());
    food.destroy();
}


gameScene.playerCollision = function(player_1, player_2) {
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
            if (!this.text) {
                this.text = this.add.text(player_to_destroy.x, player_to_destroy.y - 100, 'You lose!',
                                           {align: 'center', color: 'white', fontSize: '64px'}).setOrigin(0.5);
                this.text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
                this.text.setDepth(100);
            }

            this.text.setVisible(true);
            this.text.x = player_to_destroy.x;
            this.text.y = player_to_destroy.y - 100;
            
            var tween = this.tweens.add({
                targets: this.text,
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
        // this.time.delayedCall(1000, ()=>{ this.emitter.explode()});
        this.emitter.explode(5);
        player_to_destroy.destroy();
    }

}










var UIScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
        console.log("YESRS");

        this.score = 0;
    },

    preload: function() {
        this.load.html('scores', 'assets/scores.html');
        this.load.css('highscores_css', 'assets/myTable.css');
    },

    create: function ()
    {
        //  Our Text object to display the Score

        //  Grab a reference to the Game Scene
        var ourGame = gameScene;

        var element = this.add.dom(0, 0).createFromCache('scores');
        element.setOrigin(0);
        a = element;
        element.x += window.innerWidth - element.width - 100;
        element.y += 20;
        this.element = element;

        //  Listen for events from it
        ourGame.events.on('addScore', function () {

            this.score += 10;

            info.setText('Score: ' + this.score);

        }, this);
    }

});

var uiScene = new UIScene();

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