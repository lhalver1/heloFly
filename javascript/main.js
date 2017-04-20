var InfiniteScroller = InfiniteScroller || {};
 
// InfiniteScroller.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, '');
// InfiniteScroller.game = new Phaser.Game(800, 600, Phaser.AUTO, '');
InfiniteScroller.game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 45 * window.devicePixelRatio, Phaser.AUTO, '');

InfiniteScroller.settings = {
    isMusic: true,
    isSFX: true
};
 
InfiniteScroller.game.state.add('Boot', InfiniteScroller.Boot);
InfiniteScroller.game.state.add('Preload', InfiniteScroller.Preload);
InfiniteScroller.game.state.add('GameTitle', InfiniteScroller.GameTitle);
InfiniteScroller.game.state.add('Leaderboard', InfiniteScroller.Leaderboard);
InfiniteScroller.game.state.add('Game', InfiniteScroller.TheGame);
 
InfiniteScroller.game.state.start('Boot');

// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
//https://opengameart.com for free good content
