(function(window) {



//

function Laser(block) {

  this.initialize(block);

}


var p = Laser.prototype;





// public properties:

// constructor:

    p.Container_initialize = p.initialize;  //unique to avoid overiding base class

    

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

    }

    p.canKill = function(player) {
        return this.active;
    }

    p.tick = function(t) {
        t = (t-this.startTime) % this.period;
        this.active = (t < this.onTime);
    }

window.Laser = Laser;

}(window));