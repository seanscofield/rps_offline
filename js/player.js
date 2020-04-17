class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.image_name);
        config.scene.add.existing(this);

        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.scale = config.size;

        this.setDepth(-this.scale + 1000);

        // var fish = this.scene.add.image(0, 0, config.image_name);
        var text = this.scene.add.text(-20, -this.displayHeight/2 - 45, config.name);
        text.setColor('white');

        this.text = text;
        text.setOrigin(0.5)

        text.setStyle({
            align: 'center',
        });

        this.scene.physics.world.enable(this);
        this.addCollider(false);

        // shrink player every 1 second
        // var timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.reducePlayerSize, callbackScope: this, loop: true});
    }


    destroy() {
        this.text.destroy();
        super.destroy();
    }


    addCollider(is_flipped) {
        if (is_flipped) {
            var radius = this.displayHeight/2+1; // compute radius of circle as half of image height
            var rad_angle = Phaser.Math.DEG_TO_RAD*this.angle;
            this.body.setCircle(radius/this.scale, 0, 0); // set radius of the player's collider size
            this.body.collideWorldBounds = true; // allow player to collide with edge of screen
        } else {
            var radius = this.displayHeight/2+1; // compute radius of circle as half of image height
            var rad_angle = Phaser.Math.DEG_TO_RAD*this.angle;
            this.body.setCircle(radius/this.scale, 0, 0); // set radius of the player's collider size
            this.body.collideWorldBounds = true; // allow player to collide with edge of screen
        }
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
        this.scene.cameras.main.zoomTo(1/this.scale, 2000);
    }

    eat_player(player) {
        super.eat_player(player)
        this.scene.cameras.main.zoomTo(1/this.scale, 2000);
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
            this.isEating = true;
            this.setTexture("red_fish_eating");
            this.body.maxSpeed = this.maxSpeed + 100;
        } else {
            this.isEating = false;
            this.setTexture("red_fish_transparent");
            this.body.maxSpeed = this.maxSpeed;
        }

        var pointer = this.scene.input.activePointer;
        pointer.updateWorldPoint(this.scene.cameras.main);

        var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
        var deg_angle = Phaser.Math.RAD_TO_DEG * rad_angle;
        this.setAngle(deg_angle);

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

        var radius = this.displayHeight;
        if (Math.abs(this.angle) > 90) {
            this.setFlipY(true);
            this.addCollider(true);
        } else {
            this.setFlipY(false);
            this.addCollider(false);
        }

    }
}


var distance = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}


class AIPlayer extends Player {

    findClosestFood(foodGroup) {
        var closestFood = undefined;
        var minDist = 99999999999;

        if (foodGroup.children.entries.length > 0) {
            for (const food of foodGroup.children.entries) {
                var dist = distance(this.x, this.y, food.x, food.y);
                if (dist < minDist) {
                    minDist = dist;
                    closestFood = food;
                }
            }
            return closestFood;
        } else {
            return undefined;
        }
    }

    update(foodGroup) {
        super.update();
        
        if (this.closestFood == undefined || this.closestFood.active != true) {
            var closestFood = this.findClosestFood(foodGroup);
            this.closestFood = closestFood;
        } else {
            var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, this.closestFood.x, this.closestFood.y);
            var deg_angle = Phaser.Math.RAD_TO_DEG * rad_angle;
            this.setAngle(deg_angle);
            var x = Math.cos(rad_angle) * this.acceleration;    // accelerateToObject 
            var y = Math.sin(rad_angle) * this.acceleration;
            this.body.setAcceleration(x, y);
            var dist = distance(this.closestFood.x, this.closestFood.y, this.x, this.y);
            if (dist < 220) {
                this.isEating = true;
                this.setTexture("red_fish_eating");
                this.body.maxSpeed = this.maxSpeed + 100;
            } else {
                this.isEating = false;
                this.setTexture("red_fish_transparent");
                this.body.maxSpeed = this.maxSpeed;
            }
        }

        var radius = this.displayHeight;
        if (Math.abs(this.angle) > 90) {
            this.setFlipY(true);
            this.addCollider(true);
        } else {
            this.setFlipY(false);
            this.addCollider(false);
        }
    }
}
