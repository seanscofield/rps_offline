var color_map = {"orange": 0xff9900, "white": 0xffffff, "blue": 0x7aebff}


class MapArea extends Phaser.GameObjects.Graphics {
    constructor(config) {
        super(config.scene, config.x, config.y, config.sizeX, config.sizeY, config.color);
        this.fillStyle(color_map[config.color], 1);
        this.fillRect(config.x, config.y, config.sizeX, config.sizeY);
        this.x = config.x;
        this.y = config.y;
        this.sizeX = config.sizeX;
        this.sizeY = config.sizeY;
        config.scene.add.existing(this);

        this.spawnFood(3000);

        var timedEvent = this.scene.time.addEvent({ delay: 500, callback: this.addOneFood, callbackScope: this, loop: true});
    }

    spawnFood(numFood) {
        for (var i=0; i < numFood; i += 1) {
            var x_offset = Math.floor(20 + Math.random()*(this.sizeX-20));
            var y_offset = Math.floor(20 + Math.random()*(this.sizeY-20));
            var food = this.scene.physics.add.image(x_offset, y_offset, 'food');
            food.setScale(0.1);
            food.setDepth(2);
            this.scene.food.add(food);
        }
    }

    addOneFood() {
        this.spawnFood(1);
    }

}