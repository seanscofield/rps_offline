var Egg = function(scene, x, y, sizeX, sizeY) {
    var egg = scene.physics.add.image(x, y, 'egg'); // create player as circle on screen
    var radius = egg.displayHeight / 2; // compute radius of circle as half of image height
    egg.setScale(0.05);
    egg.setDepth(0);

    // image.body.setCircle(radius); // set radius of the player's collider size
    // image.body.collideWorldBounds = true; // allow player to collide with edge of screen
};