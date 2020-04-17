var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game',

    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
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
    this.physics.world.setBounds(0, 0, 20000, 20000);

    var map = new MapArea({scene:this, x:0, y:0, sizeX:20000, sizeY:20000, color:'blue'});
    this.map = map;

    // player.updatePhysics();


    for (element of ['red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent',
        'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent', 'red_fish_transparent']) {
        // create enemy circle
        x_offset = Math.floor(Math.random()*20000);
        y_offset = Math.floor(Math.random()*20000);
        let enemy = new AIPlayer({scene:this,x:600+x_offset,y:250 + y_offset,size:1, acceleration:1400, maxSpeed:350, image_name:element});
        fish.add(enemy);
        enemy.updatePhysics();
    }

    this.fish = fish;

    // make it so that items in the playerBalls group can collide with items in the enemies group
    this.physics.add.overlap(fish, food, eat, null, this);
    this.physics.add.overlap(fish, fish, collision, null, this);

    var scene = this;
    this.add_starting_text = add_starting_text;
    scene.cameras.main.setZoom(0.05);
    this.add_starting_text(this);


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
                y = scene;
                var spawnPoint = scene.map.findSafeSpawn();
                let player = new MainPlayer({scene:scene,x:spawnPoint.x,y:spawnPoint.y,size:1,acceleration:3500,maxSpeed:400,image_name:"red_fish_trimmed", name:inputText.value});
                player.updatePhysics();
                scene.fish.add(player);
                scene.cameras.main.zoomTo(1, 3000);
                scene.cameras.main.startFollow(player);

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


function eat(fish, food) {
    if (fish.isEating) {
        var angle_between_fish_and_food = Phaser.Math.Angle.Between(fish.x, fish.y, food.x, food.y)*Phaser.Math.RAD_TO_DEG;
        if (Math.abs(angle_between_fish_and_food - fish.angle) < 28) {
            fish.eat(food);
        }
    }


}

function collision(fish_1, fish_2) {
    if (fish_1.scale > fish_2.scale) {
        var bigger_fish = fish_1;
        var smaller_fish = fish_2;
    } else {
        var bigger_fish = fish_2;
        var smaller_fish = fish_1;
    }

    var angle_between_fish_and_food = Phaser.Math.Angle.Between(bigger_fish.x, bigger_fish.y, smaller_fish.x, smaller_fish.y)*Phaser.Math.RAD_TO_DEG;
    if (Math.abs(angle_between_fish_and_food - fish_1.angle) < 28 && bigger_fish.isEating) {
        bigger_fish.eat_player(smaller_fish);
    } else {
        bigger_fish.body.setAcceleration(0, 0);
        smaller_fish.body.setAcceleration(0, 0);
    }

}

function update()
{
    // get the mouse pointer, update its world point (it's coordinates with regards to the world),
    // and move the player in the direction of that world point.
    for (fish of this.fish.children.entries) {
        fish.update(this.food);
    }
}
