(function(window) {



//

function Player(blockSize) {

  this.initialize(blockSize);

}

var p = Player.prototype = new Container();





// public properties:

    p.blockheight;
    p.blockWidth;

// constructor:

    p.Container_initialize = p.initialize;  //unique to avoid overiding base class

    

    p.initialize = function(blockSize) {

        this.Container_initialize();

        

        this.sprite = new Shape();
        this.blockHeight = 2;
        this.blockWidth = .8;

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
        g.rect(0,0,this.blockWidth*blockSize,-this.blockHeight*blockSize);
        g.endFill();
    }

    



window.Player = Player;

}(window));