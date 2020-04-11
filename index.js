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
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{

    this.load.image('red_fish_transparent', 'assets/red_fish_transparent.png');
    this.load.image('red_fish_eating', 'assets/red_fish_eating_big.png');
    this.load.image('air', 'assets/SVG/sign-air.svg');
    this.load.image('earth', 'assets/SVG/sign-earth.svg');
    // this.load.image('fire', 'assets/SVG/sign-fire.svg');
    // this.load.image('water', 'assets/SVG/sign-water.svg');
    this.load.image('food', 'assets/SVG/sign-water.svg');
}

function create ()
{
    // create a collision group for player circle
    var fish = this.physics.add.group({
        bounceX: 2,
        bounceY: 2,
    });

    // create a collision group for player circle
    var fishMouths = this.physics.add.group({
    });

    // create a collision group for food circles
    var food = this.physics.add.group({
    });

    this.food = food;

    // give the world a width and height of 4000, and center it at (0, 0)
    this.physics.world.setBounds(0, 0, 6000, 6000);

    var map = new MapArea({scene:this, x:0, y:0, sizeX:6000, sizeY:6000, color:'blue'});

    // create player circle
    let player = new MainPlayer({scene:this,x:0,y:0,size:1,acceleration:1400,maxSpeed:400,image_name:"red_fish_transparent"});
    fishMouths.add(player.s9);
    fishMouths.add(player.s10);
    fishMouths.add(player.s11);

    fish.add(player.s2);
    // fish.add(player.s4);
    // fish.add(player.s5);
    // fish.add(player.s6);
    // fish.add(player.s7);
    // fish.add(player.s8);

    player.updatePhysics();

    this.player = player // this is needed for the update function below

    // for (element of ['red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
    //     'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent']) {
    //     // create enemy circle
    //     x_offset = Math.floor(Math.random()*5000);
    //     y_offset = Math.floor(Math.random()*5000);
    //     let enemy = new AIPlayer({scene:this,x:600+x_offset,y:250 + y_offset,size:0.8, acceleration:1400, maxSpeed:350, image_name:element});
    //     fish.add(enemy);
    //     // add_circular_collider(enemy);
    //     enemy.updatePhysics();
    // }

    this.fish = fish;

    // make it so that items in the playerBalls group can collide with items in the enemies group
    this.physics.add.overlap(fishMouths, food, eat, null, this);
    console.log(fishMouths);
    // this.physics.add.collider(fishMouths, fish, collision, null, this);
    // this.physics.add.collider(fish, fish, null, null, this);

    // Make the camera follow the player
    this.cameras.main.startFollow(player);
}


function eat(fishMouth, food) {
    console.log(fishMouth);
    if (fishMouth.parentContainer.isEating) {
        fishMouth.parentContainer.eat(food);
    }
}

function collision(fishMouth, fish) {
    var parentFish = fishMouth.parentContainer;
    if (parentFish.scale > fish.scale) {
        if (parentFish.isEating) {
            parentFish.eat_player(fish);
        }
    }
}

function update()
{
    // get the mouse pointer, update its world point (it's coordinates with regards to the world),
    // and move the player in the direction of that world point.
    let parentSet = new Set();
    for (fish of this.fish.children.entries) {
        parentSet.add(fish.parentContainer);
    }
    for (element of parentSet) {
        element.update(this.food);
    }
}
