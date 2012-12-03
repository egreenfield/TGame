(function(window) {



//

function LaserV() {

  this.initialize();

}


var p = LaserV.prototype = new GameVisual();





// public properties:

    p.blockheight;
    p.blockWidth;

// constructor:


    

    p.initialize = function() {

        GameVisual.prototype.initialize.apply(this);

        this.createGun();
        this.beam = new Shape();
        this.addChild(this.beam);

    }

    p.createGun = function() {
        this.gun = new Shape();
        this.addChild(this.gun);        
        var g = this.gun.graphics;
        g.clear();

        g.beginFill("#FF0000");
        g.rect(0,0,Game.blockSize,Game.blockSize/4);
        g.endFill();
    }

    p.assign = function(v) {
        if(v != this.object) {
            this.wasActive = true;            
        }
        GameVisual.prototype.assign.apply(this,arguments);
    }

// public methods:

    p.renderFromObject = function() {


        //draw LaserV body
        var g = this.beam.graphics;
        g.clear();
        if(this.object == null)
            return;

        var blockHeight = this.object.block.ceil - this.object.block.floor;
        var beamV = new Point(this.object.beamWidth,Game.blockSize);

        Game.instance().gameToGraphicsV(beamV);        
        g.beginStroke("#FF0000");
        g.beginFill("#FF0000");
        g.rect(Game.blockSize/2-beamV.x/2,0,beamV.x,-blockHeight*Game.blockSize);
        g.endFill();

        this.gun.y = -blockHeight*Game.blockSize; 
    }

    
    p.update = function() {
        this.beam.visible = this.object.active; 
        if(this.object.active && this.wasActive == false) {
            SoundJS.play("pew", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
        this.wasActive = this.object.active;
    }



window.LaserV = LaserV;

}(window));