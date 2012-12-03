(function(window) {



//

function SpikesV() {

  this.initialize();

}


var p = SpikesV.prototype = new GameVisual();





// public properties:

// constructor:


    

    p.initialize = function() {

        GameVisual.prototype.initialize.apply(this);

        this.sprite = new Shape();
        this.addChild(this.sprite);

    }

// public methods:

    p.renderFromObject = function() {


        //draw SpikesV body
        var g = this.sprite.graphics;
        g.clear();

        g.beginStroke("#0000FF");
        g.beginFill("#0000FF");
        g.rect(0,0,Game.blockSize,-Game.blockSize * this.object.spikeHeight);
        g.endFill();
    }    


window.SpikesV = SpikesV;

}(window));