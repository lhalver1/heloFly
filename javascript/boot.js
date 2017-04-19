
var InfiniteScroller = InfiniteScroller || {};
 
InfiniteScroller.Boot = function(){};
 
//setting game configuration and loading the assets for the loading screen
InfiniteScroller.Boot.prototype = {
  preload: function() {
    
  },
  create: function() {
    this.game.state.start('Preload');
  }
};
