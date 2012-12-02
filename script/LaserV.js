(function(window) {



//

function LaserV(blockSize) {

  this.initialize(blockSize);

}


var p = LaserV.prototype = new Container();





// public properties:

    p.blockheight;
    p.blockWidth;

// constructor:

    p.Container_initialize = p.initialize;  //unique to avoid overiding base class

    

    p.initialize = function(blockSize) {

        this.Container_initialize();


        this.sprite = new Shape();
        this.laser = null;
        this.addChild(this.sprite);

        this.blockWidth = 1;
        this.blockSize = blockSize;
        this.inUse = false;
//        this.makeShape(blockSize);

    }

    p.assign = function(v) {
        if(v != this.laser) {
            this.laser = v;
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


        //draw LaserV body
        var g = this.sprite.graphics;
        g.clear();

        if(this.laser == null)
            return;

        var blockHeight = this.laser.block.ceil - this.laser.block.floor;

        g.beginStroke("#FF0000");
        g.beginFill("#FF0000");
        g.rect(0,0,this.blockWidth*this.blockSize,-blockHeight*this.blockSize);
        g.endFill();
    }

    
    p.update = function() {
        this.visible = this.laser.active; 
        if(this.laser.active && this.wasActive == false) {
            SoundJS.play("pew", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
        this.wasActive = this.laser.active;
    }



window.LaserV = LaserV;

}(window));