class Player extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.type);
        config.scene.add.existing(this);

        // set various attributes
        this.maxSpeed = config.maxSpeed;
        this.acceleration = config.acceleration;
        this.scale = config.size;
        this.player_type = config.type;

        // enable physics on this sprite, and add a circular collider with a max speed
        this.scene.physics.world.enable(this);
        var radius = this.displayHeight/2;
        this.body.setCircle(radius, 0, 0);
        this.body.maxSpeed = this.maxSpeed;

        // Create text gameobject for the player's name. We'll make this follow the character in the update function
        this.text = this.scene.add.text(-20, -this.displayHeight/2 - 45, config.name,
                                       {align: 'center', color: 'white'}).setOrigin(0.5);
    }

    /*
     * Update player's type (type will be one of 'rock', 'paper', 'scissors', 'lizard', 'spock')
     */
    update_type(type) {
        this.setTexture(type);
        this.player_type = type;
    }


    /*
     * Destroy player and the text that follows it
     */
    destroy() {
        this.text.destroy();
        super.destroy();
    }

    /*
     * Update method that should be called by the update method in the scene.
     * This method is currently just responsible for updating the position of the text.
     */
    update() {
        this.text.x = this.body.x + this.displayHeight/2;
        this.text.y = this.body.y - 45*this.scale;
    }
}


class MainPlayer extends Player {

    destroy() {
        var text = this.scene.add.text(this.x, this.y - 100, 'You lose!',
                                       {align: 'center', color: 'white', fontSize: '64px'}).setOrigin(0.5);
        text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
        var tween = this.scene.tweens.add({
            targets: text,
            alpha: { from: 0, to: 1 },
            // alpha: { start: 0, to: 1 },
            // alpha: 1,
            // alpha: '+=1',
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
        });
        this.scene.showMenuScene(this.x, this.y);
        super.destroy();
    }


    update() {
        super.update();

        var keyObj = this.scene.input.keyboard.addKey('Space');
        var isDown = keyObj.isDown;
        if (isDown) {
            this.body.maxSpeed = this.maxSpeed + 100;
        } else {
            this.body.maxSpeed = this.maxSpeed;
        }

        var pointer = this.scene.input.activePointer;
        pointer.updateWorldPoint(this.scene.cameras.main);

        var dist = distance(this.x, this.y, pointer.worldX, pointer.worldY);
        if (dist > 15) {
            var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
            var x = Math.cos(rad_angle) * this.acceleration;
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



    update() {
        super.update();
        var foodGroup = this.scene.food;
        var playerGroup = this.scene.players;

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

        var closestPlayer = this.findClosestItem(playerGroup, this);
        this.closestPlayer = closestPlayer;

        var rad_angle = Phaser.Math.Angle.Between(this.x, this.y, this.closestPlayer.x, this.closestPlayer.y);
        var x = Math.cos(rad_angle) * this.acceleration;
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
