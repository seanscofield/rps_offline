class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.type);
        config.scene.add.existing(this);

        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.scale = config.size;
        this.player_type = config.type;

        this.setDepth(-this.scale + 1000);

        var text = this.scene.add.text(-20, -this.displayHeight/2 - 45, config.name);
        text.setColor('white');

        this.text = text;
        text.setOrigin(0.5)

        text.setStyle({
            align: 'center',
        });

        this.scene.physics.world.enable(this);

        var radius = this.displayHeight/2;
        this.body.setCircle(radius/this.scale, 0, 0); // set radius of the player's collider size
        this.body.collideWorldBounds = true; // allow player to collide with edge of screen

        // this.ts = this.scene.add.tileSprite(this.x, this.y, window.width, window.height, 'texture');

        // shrink player every 1 second
        // var timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.reducePlayerSize, callbackScope: this, loop: true});
    }

    update_type(type) {
        this.setTexture(type);
        this.player_type = type;
    }


    destroy() {
        this.text.destroy();
        super.destroy();
    }

    updatePhysics() {
        this.body.maxSpeed = this.maxSpeed;
    }



    eat(food) {
        food.destroy();
        this.setScale(0.01+this.scale);
        this.text.setScale(this.scale);
        this.setDepth(-this.scale + 1000);
    }

    eat_player(player) {
        player.text.destroy();
        player.destroy();
        this.setScale(player.scale/5+this.scale);
        this.text.setScale(this.scale);
        this.setDepth(-this.scale + 1000);
    }

    reducePlayerSize(fraction) {
        this.setScale(0.975*this.scale);
    }

    update() {
        var RotateAround = Phaser.Math.RotateAround;

        // These are the original positions, at rotation 0.
        var rad_angle = Phaser.Math.DEG_TO_RAD*(this.angle);
        this.text.x = this.body.x + this.displayHeight/2;
        this.text.y = this.body.y - 45*this.scale;
    }
}


class MainPlayer extends Player {

    eat(food) {
        super.eat(food);
        this.scene.cameras.main.zoomTo((1/this.scale)/2, 2000);
    }

    eat_player(player) {
        super.eat_player(player)
        this.scene.cameras.main.zoomTo((1/this.scale)/2, 2000);
    }


    destroy() {
        this.scene.add_starting_text(this.scene);
        super.destroy();
    }


    update() {
        super.update();

        var keyObj = this.scene.input.keyboard.addKey('Space');  // Get key object
        var isDown = keyObj.isDown;
        var velocity = this.velocity;
        if (isDown) {
            this.body.maxSpeed = this.maxSpeed + 100;
        } else {
            this.body.maxSpeed = this.maxSpeed;
        }

        var pointer = this.scene.input.activePointer;
        pointer.updateWorldPoint(this.scene.cameras.main);

        var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
        var deg_angle = Phaser.Math.RAD_TO_DEG * rad_angle;
        // this.setAngle(deg_angle);

        var dist = distance(this.x, this.y, pointer.worldX, pointer.worldY);
        if (dist > 15) {
            // this.scene.physics.moveTo(this, pointer.worldX, pointer.worldY, velocity);
            // var new_angle = Math.atan2(pointer.worldY - this.y, pointer.worldX - this.x);
            var x = Math.cos(rad_angle) * this.acceleration;    // accelerateToObject 
            var y = Math.sin(rad_angle) * this.acceleration;

            this.body.setAcceleration(x, y);

        } else {
            this.scene.physics.moveTo(this, pointer.worldX, pointer.worldY, 0);
        }

    }
}


var distance = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}


class AIPlayer extends Player {

    findClosestItem(items, me) {
        var closestItem = undefined;
        var minDist = 99999999999;

        if (items.children.entries.length > 0) {
            for (const item of items.children.entries) {
                if (item != me) {
                    var dist = distance(this.x, this.y, item.x, item.y);
                    if (dist < minDist) {
                        minDist = dist;
                        closestItem = item;
                    }
                }
            }
            return closestItem;
        } else {
            return undefined;
        }
    }



    update(foodGroup, playerGroup) {
        super.update();

        var mapping = {'rock': ['scissors', 'lizard'],
                       'paper': ['rock', 'spock'],
                       'scissors': ['paper', 'lizard'],
                       'lizard': ['spock', 'paper'],
                       'spock': ['scissors', 'rock']
                      }

        if (this.closestFood == undefined || this.closestFood.active != true) {
            var closestFood = this.findClosestItem(foodGroup);
            this.closestFood = closestFood;
        }

        // if (this.closestPlayer == undefined || this.closestPlayer.active != true) {
            var closestPlayer = this.findClosestItem(playerGroup, this);
            this.closestPlayer = closestPlayer;
        // }

        var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
        var deg_angle = Phaser.Math.RAD_TO_DEG * rad_angle;
        var x = Math.cos(rad_angle) * this.acceleration;    // accelerateToObject 
        var y = Math.sin(rad_angle) * this.acceleration;

        if (this.closestPlayer != undefined) {
            if (mapping[this.closestPlayer.player_type].includes(this.player_type)) {
                this.body.setAcceleration(-x, -y);
            } else if (mapping[this.player_type].includes(this.closestPlayer.player_type)) {
                this.body.setAcceleration(x, y);
            } 
        }

    }

}
