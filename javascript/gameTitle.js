
var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.GameTitle = function () { };

InfiniteScroller.GameTitle.prototype = {
    preload: function () {
        this.game.load.image('play', 'assets/play-text.png');
    },
    create: function () {
        this.game.stage.backgroundColor = '#999999';
        titleText = this.game.add.text(16, 16, 'Helo Fly', { fontSize: '32px' });
        titleText.fixedToCamera = true;
        titleText.stroke = '#000000';
        titleText.strokeThickness = 8;
        titleText.fill = '#43d637';

        var playButton = this.game.add.button(this.game.width/2, this.game.height/2, 'play', this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);
    },
    playTheGame: function () {
        this.game.state.start("Game");
    }
};