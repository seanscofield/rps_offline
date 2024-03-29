var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 }
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
    this.load.image('air', 'assets/SVG/sign-air.svg');
    this.load.image('earth', 'assets/SVG/sign-earth.svg');
    this.load.image('fire', 'assets/SVG/sign-fire.svg');
    this.load.image('water', 'assets/SVG/sign-water.svg');
}

function create ()
{
    // create a collision group for player circle
    var playerBalls = this.physics.add.group({
        bounceX: 1,
        bounceY: 1
    });

    // create a collision group for enemy circles
    var enemies = this.physics.add.group({
        bounceX: 1,
        bounceY: 1
    });

    // create player circle
    var player = this.physics.add.image(300, 240, 'air'); // create player as circle on screen
    playerBalls.add(player) // add player to group
    add_circular_collider(player)
    
    this.player = player // this is needed for the update function below

    for (element of ['earth', 'fire', 'water']) {
        // create enemy circle
        x_offset = Math.floor(Math.random()*500)
        y_offset = Math.floor(Math.random()*500)
        var enemy = this.physics.add.image(600 + x_offset, 250 + y_offset, element);
        enemies.add(enemy)
        add_circular_collider(enemy)
    }

    // make it so that items in the playerBalls group can collide with items in the enemies group
    this.physics.add.collider(playerBalls, enemies);
    this.physics.add.collider(enemies, enemies);
}

function update()
{
    // get mouse coordinates, and move player towards mouse
    var pointer = this.input.activePointer;
    this.physics.moveToObject(this.player, pointer, 600);
}


function add_circular_collider(image)
{
    radius = image.displayHeight / 2 // compute radius of circle as half of image height
    image.body.setCircle(radius); // set radius of the player's collider size
    image.body.collideWorldBounds = true; // allow player to collide with edge of screen
}
