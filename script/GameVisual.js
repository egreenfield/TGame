(function(window) {



//

function GameVisual() {

  this.initialize();

}


var p = GameVisual.prototype = new Container();



// public properties:

// constructor:

    
    p.initialize = function() {

        Container.prototype.initialize.apply(this);


        this.object = null;
        this.objectCache = null;
        this.inUse = false;

    }

    p.assign = function(v) {
        if(v != this.object) {
            this.object = v;
            this.inUse = (v != null);
            this.visible = this.inUse;
            if(v != null)
            {
                if(v != this.objectCache)
                    this.renderFromObject();
                this.objectCache = v;
            }

        }
    }
// public methods:

    p.renderFromObject = function() {

    }

    
    p.update = function() {
    }



window.GameVisual = GameVisual;

}(window));