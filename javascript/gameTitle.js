
var InfiniteScroller = InfiniteScroller || {};

var dir;
var helo;
var sky;

//loading the game assets
InfiniteScroller.GameTitle = function () { };

InfiniteScroller.GameTitle.prototype = {
    preload: function () {
        this.game.load.image('play', 'assets/play-text.png');
        this.game.load.image('leaderboard', 'assets/leaderboard-text.png');
        this.game.load.image('sky', 'assets/sky1.png');
        this.game.load.spritesheet('heloSheet', 'assets/helo-sprite-sheet.png', 32, 21);
    },
    create: function () {
        dir = "down";
        // this.game.stage.backgroundColor = '#999999';
        // The scrolling sky background
        // sky = this.game.add.tileSprite(0, 0, 800, 600, 'sky');
        sky = this.game.add.tileSprite(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 45 * window.devicePixelRatio, 'sky');

        //   HELO MODEL   \\
        helo = this.game.add.sprite(this.game.width / 2, 100, 'heloSheet');
        helo.scale.setTo(1.5, 1.5);
        helo.anchor.set(0.5);
        helo.animations.add('right', [0, 1, 2], 7, true);
        helo.animations.play('right');
        
        titleText = this.game.add.text(16, 16, 'Helo Fly', { fontSize: '32px' });
        titleText.fixedToCamera = true;
        titleText.stroke = '#000000';
        titleText.strokeThickness = 8;
        titleText.fill = '#43d637';

        var playButton = this.game.add.button(this.game.width/2, this.game.height/2, 'play', this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);

        var leaderBoardBtn = this.game.add.button(this.game.width/2, this.game.height/2 + 150, 'leaderboard', this.getLeaderBoard, this);
        leaderBoardBtn.anchor.setTo(0.5, 0.5);
    },
    update: function() {
        //  Scroll the background
        sky.tilePosition.x -= 2;

        if (helo.y < 125 && dir === "down") {
            helo.y += 1;
            if (helo.y >= 125) {
                dir = "up";
            }
        } else if(helo.y >= 90 && dir === "up") {
            helo.y -= 1;
            if (helo.y < 90) {
                dir = "down";
            }
        }
    },
    playTheGame: function () {
        this.game.state.start("Game");
    },
    getLeaderBoard: function() {
        this.game.state.start("Leaderboard");
    }
};