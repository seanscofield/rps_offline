class Player extends Phaser.GameObjects.Container {
    constructor(config) {
        super(config.scene, config.x, config.y);
        config.scene.add.existing(this);

        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.scale = config.size;

        var fish = this.scene.add.image(0, 0, config.image_name);
        var text = this.scene.add.text(-20, -fish.displayHeight/2 - 45, 'Sean');
        text.setColor('white');

        this.fish = fish;
        this.text = text;
        this.add(fish);

        this.scene.physics.world.enable(this);
        this.addCollider();
        
          var s2 = this.scene.physics.add.image();
          s2.body.setCircle(30);
          s2.setBounce(1);
          s2.setDebugBodyColor(0xffff00);

          var s4 = this.scene.physics.add.image();
          s4.body.setCircle(30);
          s4.setBounce(1);
          s4.setDebugBodyColor(0xffff00);

          var s5 = this.scene.physics.add.image();
          s5.body.setCircle(30);
          s5.body.setBounce(1);
          s5.setDebugBodyColor(0xffff00);

          var s6 = this.scene.physics.add.image();
          s6.body.setCircle(30);
          s6.body.setBounce(1);
          s6.setDebugBodyColor(0xffff00);

          var s7 = this.scene.physics.add.image();
          s7.body.setCircle(30);
          s7.setBounce(1);
          s7.setDebugBodyColor(0xffff00);

          var s8 = this.scene.physics.add.image();
          s8.body.setCircle(30);
          s8.body.setBounce(1);
          s8.setDebugBodyColor(0xffff00);

          var s9 = this.scene.physics.add.image();
          s9.body.setCircle(20);
          s9.body.setBounce(1);
          s9.setDebugBodyColor('blue');

          var s10 = this.scene.physics.add.image();
          s10.body.setCircle(20);
          s10.body.setBounce(1);
          s10.setDebugBodyColor('blue');

          var s11 = this.scene.physics.add.image();
          s11.body.setCircle(20);
          s11.body.setBounce(1);
          s11.setDebugBodyColor('blue');

        this.s2 = s2;
        this.s4 = s4;
        this.s5 = s5;
        this.s6 = s6;
        this.s7 = s7;
        this.s8 = s8;
        this.s9 = s9;
        this.s10 = s10;
        this.s11 = s11;

        this.add(s2);
        this.add(s4);
        this.add(s5);
        this.add(s6);
        this.add(s7);
        this.add(s8);
        this.add(s9);
        this.add(s10);
        this.add(s11);


        // shrink player every 1 second
        // var timedEvent = this.scene.time.addEvent({ delay: 1000, callback: this.reducePlayerSize, callbackScope: this, loop: true});
    }

    centerBodyOnBody (a, b) {
      a.position.set(
        b.x + b.halfWidth - a.halfWidth,
        b.y + b.halfHeight - a.halfHeight
      );
    }

    centerBodyOnXY (a, x, y) {
        a.position.set(
            x - a.halfWidth,
            y - a.halfHeight
        );
    }

    addCollider(is_flipped) {
        if (is_flipped) {
            var radius = this.fish.displayHeight/2; // compute radius of circle as half of image height
            this.body.setCircle(radius, -radius-12, -radius); // set radius of the player's collider size
            this.body.collideWorldBounds = true; // allow player to collide with edge of screen
        } else {
            var radius = this.fish.displayHeight/2; // compute radius of circle as half of image height
            this.body.setCircle(radius, -radius+12, -radius); // set radius of the player's collider size
            this.body.collideWorldBounds = true; // allow player to collide with edge of screen
        }
    }

    updatePhysics() {
        this.body.maxSpeed = this.maxSpeed;
    }

    centerBodyOnBody (a, b) {
      a.position.set(
        b.x + b.halfWidth - a.halfWidth,
        b.y + b.halfHeight - a.halfHeight
      );
    }

    centerBodyOnPoint (a, p) {
      this.centerBodyOnXY(a, p.x, p.y);
    }

    centerBodyOnXY (a, x, y) {
      a.position.set(
        x - a.halfWidth,
        y - a.halfHeight
      );
    }


    eat(food) {
        food.destroy();
        this.setScale(0.01+this.scale);
        this.s2.setScale(this.scale);
        this.s4.setScale(this.scale);
        this.s5.setScale(this.scale);
        this.s6.setScale(this.scale);
        this.s7.setScale(this.scale);
        this.s8.setScale(this.scale);
        this.s9.setScale(this.scale);
        this.s10.setScale(this.scale);
        this.s11.setScale(this.scale);
        this.text.setScale(this.scale);
    }

    eat_player(player) {
        console.log(player);
        player.destroy();
        this.setScale(player.scale+this.scale);
    }

    reducePlayerSize(fraction) {
        this.setScale(0.975*this.scale);
    }

    update() {
        var RotateAround = Phaser.Math.RotateAround;
        var s2 = this.s2;
        var s4 = this.s4;
        var s5 = this.s5;
        var s6 = this.s6;
        var s7 = this.s7;
        var s8 = this.s8;
        var s9 = this.s9;
        var s10 = this.s10;
        var s11 = this.s11;

        // These are the original positions, at rotation 0.
        var rad_angle = Phaser.Math.DEG_TO_RAD*(this.angle);
        this.text.x = this.body.x + this.scale*(this.fish.displayHeight/2 - 22);
        this.text.y = this.body.y - 45*this.scale;
        this.centerBodyOnBody(s9.body, this.body);
        this.centerBodyOnXY(s2.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s4.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s5.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s6.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s7.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s8.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 30*this.scale);
        this.centerBodyOnXY(s9.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 40*this.scale);
        this.centerBodyOnXY(s10.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 60*this.scale);
        this.centerBodyOnXY(s11.body, this.body.x + this.fish.displayHeight*this.scale/2, this.body.y + 40*this.scale);


        // Rotations need to be calculated center to center.
        this.body.updateCenter();
        s2.body.updateCenter();
        s4.body.updateCenter();
        s5.body.updateCenter();
        s6.body.updateCenter();
        s7.body.updateCenter();
        s8.body.updateCenter();
        s9.body.updateCenter();
        s10.body.updateCenter();
        s11.body.updateCenter();

        RotateAround(s2.body.center, this.body.center.x, this.body.center.y, this.rotation);
        RotateAround(s4.body.center, this.body.center.x, this.body.center.y, this.rotation - 4*Math.PI/20);
        RotateAround(s5.body.center, this.body.center.x, this.body.center.y, this.rotation - 8*Math.PI/20);
        RotateAround(s6.body.center, this.body.center.x, this.body.center.y, this.rotation - 12*Math.PI/20);
        RotateAround(s7.body.center, this.body.center.x, this.body.center.y, this.rotation - 16*Math.PI/20);
        RotateAround(s8.body.center, this.body.center.x, this.body.center.y, this.rotation - 20*Math.PI/20);
        RotateAround(s9.body.center, this.body.center.x, this.body.center.y, this.rotation - 35*Math.PI/20);
        RotateAround(s10.body.center, this.body.center.x, this.body.center.y, this.rotation - 30*Math.PI/20);
        RotateAround(s11.body.center, this.body.center.x, this.body.center.y, this.rotation - 25*Math.PI/20);

        // Then reposition.
        this.centerBodyOnPoint(s2.body, s2.body.center);
        this.centerBodyOnPoint(s4.body, s4.body.center);
        this.centerBodyOnPoint(s5.body, s5.body.center);
        this.centerBodyOnPoint(s6.body, s6.body.center);
        this.centerBodyOnPoint(s7.body, s7.body.center);
        this.centerBodyOnPoint(s8.body, s8.body.center);
        this.centerBodyOnPoint(s9.body, s9.body.center);
        this.centerBodyOnPoint(s10.body, s10.body.center);
        this.centerBodyOnPoint(s11.body, s11.body.center);

        // For proper collisions.
        s2.body.velocity.copy(this.body.velocity);
        s4.body.velocity.copy(this.body.velocity);
        s5.body.velocity.copy(this.body.velocity);
    }
}


class MainPlayer extends Player {

    eat(food) {
        food.destroy();
        this.setScale(0.01+this.scale);
        this.s2.setScale(this.scale);
        this.s4.setScale(this.scale);
        this.s5.setScale(this.scale);
        this.s6.setScale(this.scale);
        this.s7.setScale(this.scale);
        this.s8.setScale(this.scale);
        this.s9.setScale(this.scale);
        this.s10.setScale(this.scale);
        this.s11.setScale(this.scale);
        this.text.setScale(this.scale);
        this.scene.cameras.main.zoomTo(1/this.scale, 2000);
    }

    eat_player(player) {
        player.s2.destroy();
        player.s4.destroy();
        player.s5.destroy();
        player.s6.destroy();
        player.s7.destroy();
        player.s8.destroy();
        player.s9.destroy();
        player.s10.destroy();
        player.s11.destroy();
        player.text.destroy();
        player.destroy();
        this.setScale(player.scale/5+this.scale);
        this.scene.cameras.main.zoomTo(1/this.scale, 2000);
        this.s2.setScale(this.scale);
        this.s4.setScale(this.scale);
        this.s5.setScale(this.scale);
        this.s6.setScale(this.scale);
        this.s7.setScale(this.scale);
        this.s8.setScale(this.scale);
        this.s9.setScale(this.scale);
        this.s10.setScale(this.scale);
        this.s11.setScale(this.scale);
        this.text.setScale(this.scale);
    }


    update() {
        super.update();


        var keyObj = this.scene.input.keyboard.addKey('Space');  // Get key object
        var isDown = keyObj.isDown;
        var velocity = this.velocity;
        if (isDown) {
            this.isEating = true;
            this.fish.setTexture("red_fish_eating");
            this.body.maxSpeed = this.maxSpeed + 100;
        } else {
            this.isEating = false;
            this.fish.setTexture("red_fish_transparent");
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

        var radius = this.fish.displayHeight;
        if (Math.abs(this.angle) > 90) {
            this.fish.setFlipY(true);
            this.addCollider(true);
        } else {
            this.fish.setFlipY(false);
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
            var dist = distance(this.closestFood.x, this.closestFood.y, this.s10.x, this.s10.y);
            if (dist < 150) {
                this.isEating = true;
                this.fish.setTexture("red_fish_eating");
                this.body.maxSpeed = this.maxSpeed + 100;
            } else {
                this.isEating = false;
                this.fish.setTexture("red_fish_transparent");
                this.body.maxSpeed = this.maxSpeed;
            }
        }

        var radius = this.fish.displayHeight;
        if (Math.abs(this.angle) > 90) {
            this.fish.setFlipY(true);
            this.addCollider(true);
        } else {
            this.fish.setFlipY(false);
            this.addCollider(false);
        }
    }
}