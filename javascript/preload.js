
var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function () { };

InfiniteScroller.Preload.prototype = {
    preload: function () {
        //show loading screen
        // this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        // this.preloadBar.anchor.setTo(0.5);
        // this.preloadBar.scale.setTo(3);

        // this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        // var loadingBar = this.add.sprite(160, 240, "loading");
        // loadingBar.anchor.setTo(0.5, 0.5);
        // this.load.setPreloadSprite(loadingBar);
        this.game.load.image('sky', 'assets/sky.png'); //Path relative to index.html
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('thingy', 'assets/thingy.png');
        this.game.load.image('helo', 'assets/helo.png');
        // this.load.audio('whine', ['assets/audio/whine.ogg', 'assets/audio/whine.mp3']);
        // this.load.audio('bark', ['assets/audio/bark.ogg', 'assets/audio/bark.mp3']);
    },
    create: function () {
        this.state.start('GameTitle');
    }
};