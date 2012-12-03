(function(window) {



//

function ShooterV() {

  this.initialize();

}


var p = ShooterV.prototype = new GameVisual();





// public properties:

// constructor:

    p.initialize = function() {

        GameVisual.prototype.initialize.apply(this);

        this.drawGun();
        this.drawBullet();
    }

    p.drawGun = function()
    {
        this.gun = new Shape();
        this.addChild(this.gun);        
        //draw SpikesV body
        var g = this.gun.graphics;
        g.clear();

        g.beginStroke("#00FF00");
        g.beginFill("#00FF00");
        g.rect(0,0,Game.blockSize,-Game.blockSize/4);
        g.endFill();
    }

    p.drawBullet = function()
    {
        this.bullet = new Shape();
        this.addChild(this.bullet);

        var g = this.bullet.graphics;
        g.clear();
        g.beginFill("#00FF00");
        g.drawCircle(0,0,3);
        g.endFill();
    }


// public methods:
    
    p.update = function() 
    {
        this.bullet.x = Game.blockSize/2;
        var bulletP = new Point(0,this.object.bulletPosition);
        Game.instance().gameToGraphicsV(bulletP);        
        this.bullet.y = bulletP.y;

    }


window.ShooterV = ShooterV;

}(window));