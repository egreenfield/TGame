(function(window) {



//

function DeathTrap(blockSize) {

  this.initialize(blockSize);

}


DeathTrap.generate = function(block)
{
    var onTime = 1000;
    var offTime = 3000;
    var period = onTime + offTime;
    return {
        onTime: onTime,
        offTime: offTime,
        period: period,
        startTime: Math.floor(Math.random()*period),
        active: false,
        block:block
    };
}
var p = DeathTrap.prototype = new Container();





// public properties:

    p.blockheight;
    p.blockWidth;

// constructor:

    p.Container_initialize = p.initialize;  //unique to avoid overiding base class

    

    p.initialize = function(blockSize) {

        this.Container_initialize();


        this.sprite = new Shape();
        this.config = null;
        this.addChild(this.sprite);

        this.blockWidth = 1;
        this.blockSize = blockSize;
        this.inUse = false;
//        this.makeShape(blockSize);

    }

    p.assign = function(v) {
        this.config = v;
        this.makeShape();
    }

    p.setBlockHeight = function(h) {

        this.blockHeight = h;
        this.makeShape();
    }  

    p.setInUse = function(inUse) {
        if(inUse == this.inUse)
            return;
        this.inUse = inUse;
        this.visible = inUse;
    }

// public methods:

    p.makeShape = function() {

        //draw DeathTrap body
        var blockHeight = this.config.block.ceil - this.config.block.floor;
        var g = this.sprite.graphics;

        g.clear();

        g.beginStroke("#FF0000");
        g.beginFill("#FF0000");
        g.rect(0,0,this.blockWidth*this.blockSize,-blockHeight*this.blockSize);
        g.endFill();
    }

    
    p.tick = function(t) {

    }



window.DeathTrap = DeathTrap;

}(window));