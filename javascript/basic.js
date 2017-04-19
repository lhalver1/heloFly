var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var scrollSpeed = 150;

var cursors;
var emitter;
var player;
var score = 0;
var scoreText;
var walls;
var wrapping;
var wraps;

function preload() {
    game.load.image('sky', 'assets/sky.png'); //Path relative to index.html
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('thingy', 'assets/thingy.png');
    game.load.image('helo', 'assets/helo.png');
}

function create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 3500, game.height);

    //  A simple background for our game
    var background = game.add.tileSprite(0, 0, game.width + 200, game.height, 'sky');

    generateWalls();

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // // Here we create the ground.
    // var ground = platforms.create(0, game.world.height - 64, 'ground');

    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // ground.scale.setTo(5, 2);
    background.scale.setTo(4, 1);

    // //  This stops it from falling away when you jump on it
    // ground.body.immovable = true;

    //  Now let's create two ledges
    // var ledge = platforms.create(400, 400, 'ground');

    // ledge.body.immovable = true;

    // ledge = platforms.create(-150, 250, 'ground');

    // ledge.body.immovable = true;

    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('thingy');
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.minParticleScale = .5;
    emitter.maxParticleScale = .5;
    emitter.gravity.y = 150;
    emitter.bounce.y = 0.5;

    //   STARS   \\
    generateStars();


    //   PLAYER   \\
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'helo');
    player.anchor.set(0.5);
    player.scale.setTo(2);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    // player.body.bounce.y = 0.2;
    player.body.gravity.y = 0;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);


    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px' });
    scoreText.fixedToCamera = true;
    scoreText.stroke = '#000000';
    scoreText.strokeThickness = 8;
    scoreText.fill = '#43d637';
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function update() {
    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    game.physics.arcade.collide(emitter, platforms);
    game.physics.arcade.collide(emitter, walls);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.collide(player, walls);


    var cursors = game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement) otherwise keeps sliding
    player.body.velocity.y = 0;
    player.body.velocity.x = scrollSpeed;
    player.scale.setTo(2);

    if (cursors.down.isDown && cursors.right.isDown) {
        player.body.velocity.y = 200;
        player.body.velocity.x += 200;
        particalBurst();
    } else if (cursors.down.isDown && cursors.left.isDown) {
        player.body.velocity.y = 200;
        player.body.velocity.x += -70;
        player.scale.setTo(-2, 2);
    } else if (cursors.up.isDown && cursors.right.isDown) {
        player.body.velocity.y = -200;
        player.body.velocity.x += 200;
        particalBurst();
    } else if (cursors.up.isDown && cursors.left.isDown) {
        player.body.velocity.y = -200;
        player.body.velocity.x += -70;
        player.scale.setTo(-2, 2);
        // particalBurst();
    } else if (cursors.right.isDown) {
        player.body.velocity.x += 200;
        particalBurst();
    } else if (cursors.left.isDown) {
        player.body.velocity.x += -70;
        player.scale.setTo(-2, 2);
        // particalBurst();
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 200;
        // particalBurst();
    } else if (cursors.up.isDown) {
        player.body.velocity.y = -200;
        // particalBurst();
    }

    if (player.alive) {

        //We do a little math to determine whether the game world has wrapped around.
        //If so, we want to destroy everything and regenerate, so the game will remain random
        if (!wrapping && player.x < game.width) {
            //Not used yet, but may be useful to know how many times we've wrapped
            wraps++;

            //We only want to destroy and regenerate once per wrap, so we test with wrapping var
            wrapping = true;
            walls.destroy();
            generateWalls();
            stars.destroy();
            generateStars();

            game.world.bringToTop(scoreText);

        }
        else if (player.x >= game.width) {
            wrapping = false;
        }

        //The game world is infinite in the x-direction, so we wrap around.
        //We subtract padding so the player will remain in the middle of the screen when
        //wrapping, rather than going to the end of the screen first.
        game.world.wrap(player, -(game.width / 2), false, true, false);
    }
}




//   My Functions   \\
function collectStar(player, star) {

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;
    if (score === 1000) {
        game.state.start("GameTitle");
    }
}

function generateStars() {
    stars = game.add.group();
    var numStars = game.rnd.integerInRange(12, 30);
    stars.enableBody = true;

    //  Here we'll create rando of them evenly spaced apart
    for (var i = 0; i < numStars; i++) {
        //  Create a star inside of the 'stars' group
        var x = game.rnd.integerInRange(game.width, game.world.width - game.width);
        var y = game.rnd.integerInRange(0, game.height);
        star = stars.create(x, y, 'star');
        // var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        // star.body.gravity.y = 6;

        //  This just gives each star a slightly random bounce value
        // star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
}

function generateWalls() {
    walls = game.add.group();

    //enable physics in them
    walls.enableBody = true;

    //phaser's random number generator
    var numWalls = game.rnd.integerInRange(0, 7);
    var wall;

    for (var i = 0; i < numWalls; i++) {
        //add sprite within an area excluding the beginning and ending
        //  of the game world so items won't suddenly appear or disappear when wrapping
        var x = game.rnd.integerInRange(game.width, game.world.width - game.width);
        var y = game.rnd.integerInRange(0, game.height);
        wall = walls.create(x, y, 'ground');
        wall.body.velocity.x = 0;
        wall.body.immovable = true;
    }
}

function particalBurst() {
    emitter.x = player.x - 15;
    emitter.y = player.y;
    emitter.start(true, 500, null, 1);
}