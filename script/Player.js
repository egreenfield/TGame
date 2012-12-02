(function(window) {


//

function Player() {

  this.initialize();

}


// static methods

//Inheritance
// Game.prototype = new Container();
var p = Player.prototype // = new Container();




// public properties:

// constructor:


    p.initialize = function() {
        this.position = new Point(0,0);
        this.velocity = new Point(0,0);
        this.blockHeight = 2;
        this.blockWidth = .8;
    }

window.Player = Player;

}(window));