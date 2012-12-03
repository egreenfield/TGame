(function(window) {



var BULLETSPEED = .01;
//

function Shooter(block) {

  this.initialize(block);

}


var p = Shooter.prototype = new GameObject;

GameObject.initType(Shooter,ShooterV);







// public properties:

// constructor:


    p.initialize = function(block) {

        GameObject.prototype.initialize.apply(this,arguments)

        this.period = 1000;
        this.bulletSpeed = BULLETSPEED;
        this.bulletPosition = 0;
        this.startTime =  Math.floor(Math.random()*this.period);
    }

    p.canKill = function(player) {
        var bulletGlobalP = this.bulletPosition + this.block.floor;
        if(player.position.x > this.block.pos + .5)
            return false;
        if(player.position.x + player.blockWidth < this.block.pos + .5)
            return false;
        if(player.position.y > bulletGlobalP)
            return false;
        if(player.position.y + player.blockHeight < bulletGlobalP)
            return false;

        return true;
    }

    p.tick = function(t) {
        t = (t-this.startTime) % this.period;
        this.bulletPosition = t*this.bulletSpeed;
    }

window.Shooter = Shooter;

}(window));