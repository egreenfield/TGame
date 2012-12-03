(function(window) {

    var SPIKEHEIGHT = .25;


//

function Spikes(block) {

  this.initialize(block);

}


var p = Spikes.prototype = new GameObject;

GameObject.initType(Spikes,SpikesV);




// public properties:

// constructor:


    p.initialize = function(block) {

        this.block = block;
        this.spikeHeight = SPIKEHEIGHT;

    }

    p.canKill = function(player) {
        return (player.position.y < this.block.floor + SPIKEHEIGHT);
    }

    p.tick = function(t) {
    }

window.Spikes = Spikes;

}(window));