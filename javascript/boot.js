
var InfiniteScroller = InfiniteScroller || {};
 
InfiniteScroller.Boot = function(){};
 
//setting game configuration and loading the assets for the loading screen
InfiniteScroller.Boot.prototype = {
  preload: function() {
    
  },
  create: function() {
    config = {
        apiKey: "AIzaSyDnxvGLjbdy_c074-dw1VqYJEVWPYuz3MI",
        authDomain: "heloflyscoreboard.firebaseapp.com",
        databaseURL: "https://heloflyscoreboard.firebaseio.com",
        projectId: "heloflyscoreboard",
        storageBucket: "heloflyscoreboard.appspot.com",
        messagingSenderId: "227421731216"
    };
    firebase.initializeApp(config);
    this.game.state.start('Preload');
  }
};
