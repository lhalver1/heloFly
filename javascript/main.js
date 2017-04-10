var InfiniteScroller = InfiniteScroller || {};
 
InfiniteScroller.game = new Phaser.Game(800, 600, Phaser.AUTO, '');
 
InfiniteScroller.game.state.add('Boot', InfiniteScroller.Boot);
InfiniteScroller.game.state.add('Preload', InfiniteScroller.Preload);
InfiniteScroller.game.state.add('GameTitle', InfiniteScroller.GameTitle);
InfiniteScroller.game.state.add('Game', InfiniteScroller.TheGame);
 
InfiniteScroller.game.state.start('Boot');

// var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
