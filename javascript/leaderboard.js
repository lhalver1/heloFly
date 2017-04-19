
var InfiniteScroller = InfiniteScroller || {};
var database;
var scoreboard;
var scoreboardText;
var scoreboardStyle;

//loading the game assets
InfiniteScroller.Leaderboard = function () { };

InfiniteScroller.Leaderboard.prototype = {
    preload: function () {
        this.game.load.image('play', 'assets/play-text.png');
    },
    create: function () {
        debugger;
        scoreboard= [];
        
        database = firebase.database();

        var scoreboard = firebase.database().ref('scoreboard/');
        scoreboard.on('value', function(snapshot) {
            debugger;
            console.log("Got leaderboard, data: " + snapshot.val());
            updateView(snapshot.val());
        });

        // Setup the view
        var playButton = this.game.add.button(this.game.width/2, this.game.height/2, 'play', this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);

        scoreboardStyle = { font: "16px Courier", fill: "#fff", tabs: [ 164, 120, 80 ] };

        var headings = [ 'Name', 'Score' ];

        scoreboardText = this.game.add.text(32, 64, '', scoreboardStyle);
        scoreboardText.parseList(headings);

        // writeNewPost("meh", 111);
    },
    playTheGame: function () {
        this.game.state.start("GameTitle");
    }
};

function updateView(tableObject) {
    scoreboard = [];
    for (var key in tableObject) {
        if (tableObject.hasOwnProperty(key)) {
            var scoreObject = tableObject[key];
            var scoreItemArr = [];

            scoreObject.uid = key;
            // scoreItemArr.push(scoreObject.uid);
            scoreItemArr.push(scoreObject.name);
            scoreItemArr.push(scoreObject.score);

            scoreboard.push(scoreItemArr);
        }
    }
    console.log(scoreboard);
    var text2 = InfiniteScroller.game.add.text(32, 120, '', scoreboardStyle);
    text2.parseList(scoreboard);
}

function writeNewPost(name, score) {
    debugger;
  // A post entry.
  var postData = {
    name: name,
    score: score
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('scoreboard').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/scoreboard/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

function writeUserData(name, data, uid) {
  firebase.database().ref('scoreboard/').set({
    uid: uid,
    name: name,
    score: score
  });
}