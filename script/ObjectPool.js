(function(window) {


//

function ObjectPool(allocator,initializer,releaser) {

  this.initialize(allocator,initializer,releaser);

}


// static methods

//Inheritance
// Game.prototype = new Container();
var p = ObjectPool.prototype // = new Container();




// public properties:

// constructor:


    p.initialize = function(allocator,initializer,releaser) {
        this.allocator = allocator;
        this.initializer = initializer;
        this.releaser = releaser;

        this.live = [];        
        this.reserve = [];
    }

    p.allocate = function() {
        var instance;
        if(this.reserve.length > 0)
        {
            instance = this.reserve.pop();
        }
        else
        {
            instance = this.allocator();
        }
        this.live.push(instance);
        if(this.initializer) this.initializer.apply(instance,arguments);
        return instance;
    }

    p.release = function(instance) {
        for(var i=0;i<this.live.length;i++)
        {
            if(this.live[i] == instance)
            {
                this.live.splice(i,1);
                break;
            }
        }
        if(this.releaser) this.releaser.apply(instance)
        this.reserve.push(instance);
    }

    p.clean = function() {
        this.reserve = [];
    }
    p.releaseAll = function() {
        for(var i=0;i<this.live.length;i++)
        {
            instance = this.live[i];
            if(this.releaser) this.releaser.apply(instance);
            this.reserve.push(instance);
        }
        this.live = [];
    }

window.ObjectPool = ObjectPool
;

}(window));