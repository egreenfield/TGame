(function(window) {



//

function PlayerV(player,blockSize) {

  this.initialize(player,blockSize);

}

var p = PlayerV.prototype = new Container();





// public properties:

    p.blockheight;
    p.blockWidth;

// constructor:

    p.Container_initialize = p.initialize;  //unique to avoid overiding base class

    

    p.initialize = function(player,blockSize) {

        this.Container_initialize();

        this.player = player;

        this.sprite = new Shape();

        this.addChild(this.sprite);

        this.makeShape(blockSize);

    }

    

// public methods:

    p.makeShape = function(blockSize) {

        //draw Player body

        var g = this.sprite.graphics;

        g.clear();

        g.beginStroke("#FF0000");
        g.beginFill("#000000");
        g.rect(0,0,this.player.blockWidth*blockSize,-this.player.blockHeight*blockSize);
        g.endFill();
    }

    



window.PlayerV = PlayerV;

}(window));