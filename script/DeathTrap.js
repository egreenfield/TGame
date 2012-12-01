(function(window) {



//

function DeathTrap(blockSize) {

  this.initialize(blockSize);

}


DeathTrap.generate = function(block)
{
    var onTime = 200;
    var offTime = 1000;
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
        if(v != this.config) {
            this.config = v;
            this.wasActive = true;
            this.makeShape();
            this.inUse = (v != null);
            this.visible = this.inUse;
        }
    }

    p.setBlockHeight = function(h) {

        this.blockHeight = h;
        this.makeShape();
    }  

// public methods:

    p.makeShape = function() {


        //draw DeathTrap body
        var g = this.sprite.graphics;
        g.clear();

        if(this.config == null)
            return;
        
        var blockHeight = this.config.block.ceil - this.config.block.floor;

        g.beginStroke("#FF0000");
        g.beginFill("#FF0000");
        g.rect(0,0,this.blockWidth*this.blockSize,-blockHeight*this.blockSize);
        g.endFill();
    }

    
    p.tick = function(t) {
        t = (t-this.config.startTime) % this.config.period;
        this.config.active = (t < this.config.onTime);
        this.visible = this.config.active; 
        if(this.config.active && this.wasActive == false) {
            SoundJS.play("pew", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
        this.wasActive = this.config.active;
    }



window.DeathTrap = DeathTrap;

}(window));