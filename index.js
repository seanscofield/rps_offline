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
    this.load.image('circle', 'assets/white_circle.png');
    this.load.image('circle_small', 'assets/white_circle_now_working.png');
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
    var player = this.physics.add.image(300, 240, 'circle'); // create player as circle on screen
    playerBalls.add(player) // add player to group
    radius = player.displayHeight/2
    player.body.setCircle(radius); // this sets the radius of the player's collider size
    player.body.collideWorldBounds = true; // set to True so that player can collide with edge of screen
    this.player = player // this is needed for the update function below

    // create enemy circle (same sort of logic as above)
    var enemy = this.physics.add.image(600, 240, 'circle_small');
    enemies.add(enemy)
    radius = enemy.displayHeight/2
    enemy.body.setCircle(radius);
    enemy.body.collideWorldBounds = true;

    // make it so that items in the playerBalls group can collide with items in the enemies group
    this.physics.add.collider(playerBalls, enemies);
}

function update()
{
    // get mouse coordinates, and move player towards mouse
    var pointer = this.input.activePointer;
    this.physics.moveToObject(this.player, pointer, 240);
}
