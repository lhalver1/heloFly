
var InfiniteScroller = InfiniteScroller || {};

//loading the game assets
InfiniteScroller.Preload = function () { };

InfiniteScroller.Preload.prototype = {
    preload: function () {
        
    },
    create: function () {
        this.game.state.start('GameTitle');
    }
};