
var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.GameTitle = function () { };

InfiniteScroller.Preload.prototype = {
    preload: function () {
       
    },
    create: function () {
        titleText = this.game.add.text(16, 16, 'Helo Fly', { fontSize: '32px' });
        titleText.fixedToCamera = true;
        titleText.stroke = '#000000';
        titleText.strokeThickness = 8;
        titleText.fill = '#43d637';

        var playButton = this.game.add.button(160, 320, "play", this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);
    },
    playTheGame: function () {
        this.game.state.start("Game");
    }
};