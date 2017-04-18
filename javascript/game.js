

var InfiniteScroller = InfiniteScroller || {};

InfiniteScroller.TheGame = function () { };

var scrollSpeed = 150;
var speedIncrease = scrollSpeed * 2;

var cursors;
var emitter;
var player;
var score = 0;
var scoreText;
var speedText;
var walls;
var wrapping;
var wraps;


//setting game configuration and loading the assets for the loading screen
InfiniteScroller.TheGame.prototype = {
    preload: function () {
        this.game.load.image('sky', 'assets/sky.png'); //Path relative to index.html
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('wall', 'assets/wall.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('thingy', 'assets/thingy.png');
        this.game.load.image('helo', 'assets/helo.png');
        this.game.load.spritesheet('heloSheet', 'assets/helo-sprite-sheet.png', 32, 21);
        this.game.load.image('explode', 'assets/explosion.gif');
    },
    create: function () {
        scrollSpeed = 150;
        speedIncrease = scrollSpeed * 2;

        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.world.setBounds(0, 0, 1600, this.game.height);

        //  A simple background for our game
        var background = this.game.add.tileSprite(0, 0, this.game.width + 200, this.game.height, 'sky');

        generateWalls();

        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = this.game.add.group();

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

        emitter = this.game.add.emitter(0, 0, 100);
        emitter.makeParticles('thingy');
        emitter.minRotation = 0;
        emitter.maxRotation = 0;
        emitter.minParticleScale = .5;
        emitter.maxParticleScale = .5;
        emitter.gravity.y = 150;
        emitter.bounce.setTo(0.5, 0.5);

        //   STARS   \\
        generateStars();


        //   PLAYER   \\
        // The player and its settings
        player = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'heloSheet');
        player.anchor.set(0.5);
        player.isAlive = true;
        // player.scale.setTo(.5);

        // player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [0, 1, 2], 7, true);
        player.animations.play('right');

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
        // player.body.bounce.y = 0.2;
        player.body.gravity.y = 0;
        player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        // player.animations.add('left', [0, 1, 2, 3], 10, true);
        // player.animations.add('right', [5, 6, 7, 8], 10, true);


        scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px' });
        scoreText.fixedToCamera = true;
        scoreText.stroke = '#000000';
        scoreText.strokeThickness = 8;
        scoreText.fill = '#43d637';
        
        speedText = this.game.add.text(16, 55, 'Speed: '+scrollSpeed/3, { fontSize: '32px' });
        speedText.fixedToCamera = true;
        speedText.stroke = '#000000';
        speedText.strokeThickness = 8;
        speedText.fill = '#43d637';
        // this.game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    },
    update: function () {
        spawnWall();
        spawnStar();

        //  Collide the player and the stars with the platforms
        var hitPlatform = this.game.physics.arcade.collide(player, platforms);

        this.game.physics.arcade.overlap(player, stars, collectStar, null, this);
        this.game.physics.arcade.collide(player, walls, blowup, null, this);

        if (player.isAlive) {
            var cursors = this.game.input.keyboard.createCursorKeys();

            //  Reset the players velocity (movement) otherwise keeps sliding
            player.body.velocity.y = 0;
            player.body.velocity.x = 0;

            if (cursors.right.isUp) {
                normalizeSpeed();
            }

            if (cursors.down.isDown) {
                player.body.velocity.y = 200;
                // particalBurst();
            } else if (cursors.up.isDown) {
                player.body.velocity.y = -200;
                // particalBurst();
            } else if (cursors.right.isDown) {
                speedPlayerUp();
                particalBurst();
            }
        }

    }
};


//   My Functions   \\
function blowup(player, wall) {
    player.isAlive = false;
    stopMoving();
    speedText.text = 'Speed: 0 mph';

    player.body.velocity.y = 0;
    player.body.velocity.x = 0;
    emitter.on = false;
    player.kill();

    // Removes the star from the screen
    var x = player.body.x;
    var y = player.body.y;
    xplode = this.game.add.sprite(x, y, 'explode');
    xplode.anchor.set(0.5);

    setTimeout(function () {
        score = 0;
        InfiniteScroller.game.state.start("Boot");
    }, 1000);
}

function collectStar(player, star) {
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

    if (score != 0 && score % 200 === 0) {
        speedGameUp();
    }
}

function generateStars() {
    stars = InfiniteScroller.game.add.group();
    var numStars = InfiniteScroller.game.rnd.integerInRange(12, 20);
    stars.enableBody = true;
    //  Here we'll create rando of them evenly spaced apart
    for (var i = 0; i < numStars; i++) {
        //  Create a star inside of the 'stars' group
        var x = InfiniteScroller.game.rnd.integerInRange(InfiniteScroller.game.width, InfiniteScroller.game.world.width);
        var y = InfiniteScroller.game.rnd.integerInRange(0, InfiniteScroller.game.height);
        star = stars.create(x, y, 'star');
        // var star = stars.create(i * 70, 0, 'star');

        star.body.velocity.x = -scrollSpeed;
        star.body.immovable = true;

        //When the block leaves the screen, kill it
        star.checkWorldBounds = true;
        star.outOfBoundsKill = true;
    }
}

function generateWalls() {
    walls = InfiniteScroller.game.add.group();

    walls.enableBody = true;

    var numWalls = InfiniteScroller.game.rnd.integerInRange(5, 10);
    var wall;

    for (var i = 0; i < numWalls; i++) {
        var x = InfiniteScroller.game.rnd.integerInRange(InfiniteScroller.game.width, InfiniteScroller.game.world.width);
        var y = InfiniteScroller.game.rnd.integerInRange(0, InfiniteScroller.game.height);
        wall = walls.create(x, y, 'wall');

        wall.body.velocity.x = -scrollSpeed;
        wall.body.immovable = true;

        //When the block leaves the screen, kill it
        wall.checkWorldBounds = true;
        wall.outOfBoundsKill = true;
    }
}

function normalizeSpeed() {
    updateSpeedText(false);
    walls.forEach(function (wall) {
        wall.body.velocity.x = -scrollSpeed;
    });
    stars.forEach(function (star) {
        star.body.velocity.x = -scrollSpeed;
    });
}

function spawnStar() {
    //  Get a dead item
    var star = stars.getFirstDead();

    if (star) {
        //  And bring it back to life
        star.reset(InfiniteScroller.game.width, InfiniteScroller.game.rnd.integerInRange(0, InfiniteScroller.game.world.height));
        star.body.velocity.x = -scrollSpeed;
        star.body.immovable = true;

        //When the block leaves the screen, kill it
        star.checkWorldBounds = true;
        star.outOfBoundsKill = true;

        //  This just changes its frame
        // star.frame = InfiniteScroller.game.rnd.integerInRange(0, 36);
    }
}

function spawnWall() {
    //  Get a dead item
    var wall = walls.getFirstDead();

    if (wall) {
        //  And bring it back to life
        wall.reset(InfiniteScroller.game.width, InfiniteScroller.game.rnd.integerInRange(0, InfiniteScroller.game.world.height));
        wall.body.velocity.x = -scrollSpeed;
        wall.body.immovable = true;

        //When the block leaves the screen, kill it
        wall.checkWorldBounds = true;
        wall.outOfBoundsKill = true;

        //  This just changes its frame
        // wall.frame = InfiniteScroller.game.rnd.integerInRange(0, 36);
    }
}

function speedPlayerUp() {
    updateSpeedText(true);
    walls.forEach(function (wall) {
        wall.body.velocity.x = -(scrollSpeed + speedIncrease);
    });
    stars.forEach(function (star) {
        star.body.velocity.x = -(scrollSpeed + speedIncrease);
    });
}

function speedGameUp() {
    scrollSpeed += 35;
    updateSpeedText(false);
}

function stopMoving() {
    walls.forEach(function (wall) {
        wall.body.velocity.x = 0;
    });
    stars.forEach(function (star) {
        star.body.velocity.x = 0;
    });
}

function updateSpeedText(speedIncrease) {
    if (speedIncrease) {
        speedText.text = 'Speed: ' + Math.round(scrollSpeed+speedIncrease/4) + ' mph';
    } else {
        speedText.text = 'Speed: ' + Math.round(scrollSpeed/4) + ' mph';
    }
}

function particalBurst() {
    emitter.x = player.x - 15;
    emitter.y = player.y;
    emitter.setXSpeed(-100, -200);
    emitter.setYSpeed(-50, 50);
    emitter.start(true, 500, null, 1);
}