(function(window) {


//

function Player() {

  this.initialize();

}


// static methods

//Inheritance
// Game.prototype = new Container();
var p = Player.prototype  = new GameObject();




// public properties:

// constructor:


    p.initialize = function() {
        GameObject.prototype.initialize.apply(this,[]);
        this.position = new Point(0,0);
        this.velocity = new Point(0,0);
        this.blockHeight = 2;
        this.blockWidth = .8;
    }

window.Player = Player;

}(window));