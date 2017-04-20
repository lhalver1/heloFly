
var InfiniteScroller = InfiniteScroller || {};
var database;
var dir;
var leaderboardLabel;
var scoreboard;
var scoreboardHeaderText;
var scoreboardStyle;
var scoreboardScoresText;
var sky;

//loading the game assets
InfiniteScroller.Leaderboard = function () { };

InfiniteScroller.Leaderboard.prototype = {
    preload: function () {
        this.game.load.image('sky', 'assets/sky1.png');
    },
    create: function () {
        scoreboard = [];
        dir = "inc";

        // The scrolling sky background
        sky = this.game.add.tileSprite(0, 0, window.innerWidth * window.devicePixelRatio, (window.innerHeight * window.devicePixelRatio) - 45 * window.devicePixelRatio, 'sky');

        database = firebase.database();

        var scoreboard = firebase.database().ref('scoreboard/').orderByChild('score');
        scoreboard.on('value', function (snapshot) {
            if (scoreboardScoresText) {
                scoreboardScoresText.setText('');
            }
            updateView(snapshot.val());
        });

        // Leaderboard Label
        leaderboardLabel = this.game.add.text(this.game.width/2, 50, 'Leaderboard', { fontSize: '32px' });
        leaderboardLabel.anchor.setTo(0.5, 0.5);
        leaderboardLabel.stroke = '#000000';
        leaderboardLabel.strokeThickness = 8;
        leaderboardLabel.fill = '#43d637';

        // Back label button
        backLabel = this.game.add.text(16, 16, 'Back', { font: '24px Arial', fill: '#fff' });
        backLabel.inputEnabled = true;
        backLabel.events.onInputUp.add(function () {
            InfiniteScroller.game.state.start("GameTitle");
        });

        scoreboardStyle = { font: "16px Courier", fill: "#fff", tabs: [164, 120] };

        var headings = ['Name', 'Score'];

        scoreboardHeaderText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 60, '', scoreboardStyle);
        scoreboardHeaderText.anchor.setTo(0.5, 0.5);
        scoreboardHeaderText.parseList(headings);
    },
    update: function () {
        //  Scroll the background
        sky.tilePosition.x -= 2;

        if (leaderboardLabel.fontSize < 80 && dir === "inc") {
            leaderboardLabel.fontSize += 1;
            if (leaderboardLabel.fontSize >= 80) {
                dir = "dec";
            }
        } else if(leaderboardLabel.fontSize >= 32 && dir === "dec") {
            leaderboardLabel.fontSize -= 1;
            if (leaderboardLabel.fontSize < 32) {
                dir = "inc";
            }
        }
    }//,
    // playTheGame: function () {
    //     this.game.state.start("GameTitle");
    // }
};

function sortScores(scoreboard) {
    scoreboard.sort(function(a, b){
        return b[1]-a[1];
    });
    return scoreboard;
}

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
    scoreboardScoresText = InfiniteScroller.game.add.text(InfiniteScroller.game.width / 2, InfiniteScroller.game.height / 2, '', scoreboardStyle);
    scoreboardScoresText.anchor.setTo(0.5, 0.5);
    
    scoreboard = sortScores(scoreboard);

    scoreboardScoresText.parseList(scoreboard);
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