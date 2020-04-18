var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',

    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
        },
        matter: {
            enableSleeping: true,
            gravity: {
                y: 0
            },
            debug: {
                showBody: true,
                showStaticBody: true
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        add_starting_text: add_starting_text
    },
    dom: {
        createContainer: true
    },
};

var game = new Phaser.Game(config);

function preload ()
{

    this.load.image('red_fish_transparent', 'assets/red_fish_trimmed.png');
    this.load.image('red_fish_eating', 'assets/red_fish_eating_trimmed_3.png');
    this.load.image('air', 'assets/SVG/sign-air.svg');
    this.load.image('earth', 'assets/SVG/sign-earth.svg');
    this.load.image('food', 'assets/SVG/sign-water.svg');
    this.load.image('rock', 'assets/Rock.png');
    this.load.image('paper', 'assets/Paper.png');
    this.load.image('scissors', 'assets/Scissors.png');
    this.load.image('lizard', 'assets/Lizard.png');
    this.load.image('spock', 'assets/Spock.png');
    this.load.image('texture', 'assets/texture.jpg');

    this.load.html('nameform', 'assets/text/nameform.html');
}

function create ()
{
    // create a collision group for player circle
    var fish = this.physics.add.group({
        bounceX: 0.5,
        bounceY: 0.5,
    });

    // create a collision group for food circles
    var food = this.physics.add.group({
    });

    this.food = food;
    this.fish = fish;

    // give the world a width and height of 4000, and center it at (0, 0)
    this.physics.world.setBounds(0, 0, 10000, 10000);

    var map = new MapArea({scene:this, x:0, y:0, sizeX:10000, sizeY:10000, color:'blue'});
    this.map = map;

    var totalPlayers = this.fish.children.entries.length;
    for (var i = totalPlayers; i < 50; i+=1) {
        var mapping = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        var image = mapping[Math.floor(Math.random() * 4) + 1];
        var spawnPoint = findBestSpawnPoint(10000, 10000, this.fish.children.entries);
        let enemy = new AIPlayer({scene:this,x:spawnPoint.x,y:spawnPoint.y,size:1, acceleration:1400, maxSpeed:350, type:image});
        this.fish.add(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.updatePhysics();
    }

    var timedEvent = this.time.addEvent({ delay: 1000, callback: spawnAIPlayers, callbackScope: this, loop: true});

    this.add.grid(5000, 5000, 10000, 10000, 64, 64, 0x000000 );

    this.fish = fish;

    // make it so that items in the playerBalls group can collide with items in the enemies group
    this.physics.add.overlap(fish, food, transform, null, this);
    this.physics.add.overlap(fish, fish, collision, null, this);

    var scene = this;
    this.add_starting_text = add_starting_text;
    scene.cameras.main.setZoom(0.05);
    this.add_starting_text(this);

    // config.scene.add.tileSprite(500, 500, 1000, 1000, 'texture');

}

function add_starting_text(scene) {
    // Make the camera follow the player

    var element = this.add.dom(10000, 15000).createFromCache('nameform');

    scene.cameras.main.zoomTo(0.05, 2000);
    element.setScale(20);

    element.addListener('click');

    scene.cameras.main.startFollow(element);

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
                // text.setText('Welcome ' + inputText.value);
                // create player circle
                // var spawnPoint = scene.map.findSafeSpawn();
                var spawnPoint = {"x": 5000, "y": 5000};
                let player = new MainPlayer({scene:scene,x:spawnPoint.x,y:spawnPoint.y,size:1,acceleration:3500,maxSpeed:400,type:"rock", name:inputText.value});
                player.updatePhysics();
                scene.fish.add(player);
                scene.cameras.main.zoomTo(0.67, 3000);
                scene.cameras.main.startFollow(player);
                player.body.collideWorldBounds = true;

            }
            else
            {
                //  Flash the prompt
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0.2,
                    duration: 250,
                    ease: 'Power3',
                    yoyo: true
                });
                        }
        }

    });
 
    this.tweens.add({
        targets: element,
        y: 10000,
        duration: 3000,
        ease: 'Power3'
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

function spawnAIPlayers() {
    var totalPlayers = this.fish.children.entries.length;
    for (var i = totalPlayers; i < 50; i+=1) {
        var mapping = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
        var image = mapping[Math.floor(Math.random() * 4) + 1];
        var spawnPoint = findBestSpawnPoint(10000, 10000, this.fish.children.entries);
        let enemy = new AIPlayer({scene:this,x:spawnPoint.x,y:spawnPoint.y,size:1, acceleration:1400, maxSpeed:350, type:image});
        this.fish.add(enemy);
        enemy.body.collideWorldBounds = true;
        enemy.updatePhysics();
    }
}

function transform(fish, food) {
    var mapping = ['rock', 'paper', 'scissors', 'lizard', 'spock'];
    var new_type = mapping[Math.floor(Math.random() * 4) + 1];
    fish.update_type(new_type);
    food.destroy();
}


function eat(fish, food) {
    fish.eat(food);
}

function collision(player_1, player_2) {
    var mapping = {'rock': ['scissors', 'lizard'],
                   'paper': ['rock', 'spock'],
                   'scissors': ['paper', 'lizard'],
                   'lizard': ['spock', 'paper'],
                   'spock': ['scissors', 'rock']
                  }
    var player_1_type = player_1.player_type;
    var player_2_type = player_2.player_type;
    if (mapping[player_1_type].includes(player_2_type)) {
        player_2.destroy();
    } else if (mapping[player_2_type].includes(player_1_type)) {
        player_1.destroy();
    }

}

function update()
{
    // get the mouse pointer, update its world point (it's coordinates with regards to the world),
    // and move the player in the direction of that world point.
    for (fish of this.fish.children.entries) {
        fish.update(this.food, this.fish);
    }
}
