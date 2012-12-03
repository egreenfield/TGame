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

        this.sprite = new Shape();
        this.addChild(this.sprite);

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
        var g = this.sprite.graphics;
        g.clear();
        if(this.object == null)
            return;

        var blockHeight = this.object.block.ceil - this.object.block.floor;

        g.beginStroke("#FF0000");
        g.beginFill("#FF0000");
        g.rect(0,0,Game.blockSize,-blockHeight*Game.blockSize);
        g.endFill();
    }

    
    p.update = function() {
        this.visible = this.object.active; 
        if(this.object.active && this.wasActive == false) {
            SoundJS.play("pew", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
        this.wasActive = this.object.active;
    }



window.LaserV = LaserV;

}(window));