(function(window) {


//

function GameObject() {

  this.initialize();

}


var assign = function(gObj) {
    this.assign(gObj);
}
var release = function() {
    this.assign(null);
}
// static methods

//Inheritance
// Game.prototype = new Container();
var p = GameObject.prototype // = new Container();



GameObject.initType = function(type,visualType)
{
        type.visualType = visualType;
        type.visualPool = new ObjectPool(function() {return new visualType()},assign,release);
        type.prototype.visualPool = type.visualPool;
}

// public properties:

// constructor:



    p.initialize = function(block) {
        this.block = block;
    }


window.GameObject = GameObject
;

}(window));