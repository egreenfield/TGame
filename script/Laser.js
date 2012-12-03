(function(window) {


    var BEAMWIDTH = .05;
//

function Laser(block) {

  this.initialize(block);

}


var p = Laser.prototype = new GameObject;

GameObject.initType(Laser,LaserV);




// public properties:

// constructor:


    p.initialize = function(block) {

        var onTime = 200;
        var offTime = 1000;
        var period = onTime + offTime;
        this.onTime = onTime;
        this.offTime = offTime;
        this.period = period;
        this.startTime =  Math.floor(Math.random()*period);
        this.active = false;
        this.block = block;
        this.beamWidth = BEAMWIDTH;

    }

    p.canKill = function(player) {
        if( this.active == false)
            return false;
        if(player.position.x > this.block.pos + .5 + this.beamWidth/2)
            return false;
        if(player.position.x + player.blockWidth < (this.block.pos + .5 - this.beamWidth/2))
            return false;

        return true;

    }

    p.tick = function(t) {
        t = (t-this.startTime) % this.period;
        this.active = (t < this.onTime);
    }

window.Laser = Laser;

}(window));