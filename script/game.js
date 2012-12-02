(function(window) {


var KEYCODE_ENTER = 13;     //usefull keycode
    var KEYCODE_SPACE = 32;     //usefull keycode
    var KEYCODE_UP = 38;        //usefull keycode
    var KEYCODE_LEFT = 37;      //usefull keycode
    var KEYCODE_RIGHT = 39;     //usefull keycode
    var KEYCODE_W = 87;         //usefull keycode
    var KEYCODE_A = 65;         //usefull keycode
    var KEYCODE_D = 68;         //usefull keycode


    var BLOCKSIZE = 70;
    var LATERAL_VELOCITY = .1;
    var MAX_LATERAL_VELOCITY = .35;
    var FRICTION = .4;
    var GRAVITY = -.05;
    var JUMP_VELOCITY = .5;
    var MAX_HOLE_SIZE = 3;
    var LEVEL_START_SAFE_ZONE = 5;

    var STATE_PLAYING = 0;
    var STATE_DYING = 1;

    var gameInstance = null;


//

function Game(stage) {

  this.initialize(stage);

}


// static methods

//Inheritance
// Game.prototype = new Container();
var p = Game.prototype // = new Container();




// public properties:

    p.forwardHeld;
    p.backHeld;
    p.jumpHeld;

    p.canvas;         //Main canvas
    p.stage;          //Main display stage


    p.stage;
    p.state = STATE_PLAYING;
    p.offset = 0;

    p.manifest = [
            {id:"music", src:"assets/music.mp3"}
            ,{id:"bounce", src:"assets/bounce.mp3"}
            ,{id:"pew", src:"assets/pew.mp3"}
            ,{id:"death", src:"assets/death.mp3"}
        ];

// constructor:


    p.initialize = function(stage) {
//register key functions
        gameInstance = this;
        this.stage = stage;
        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;

    }

    p.start = function() {
        this.restart();
    }

    p.generateLevelData = function(levelData)
    {
        var currentHeight = 3;
        var holeCount = 0;
        var minHeight = 0;
        var maxHeight = 4;
        var minCorridorHeight = 4;
        var maxCorridorHeight = 7;
        for(var i=0;i<1000;i++)
        {
//            console.log("current height:",currentHeight);
            var delta = Math.floor(Math.random() * 3) - 1;
            
//            console.log("delta:",delta);
            var newHeight = currentHeight + delta;
            newHeight = Math.max(minHeight,newHeight);
            newHeight = Math.min(maxHeight,newHeight);
            if(newHeight == 0 && holeCount == MAX_HOLE_SIZE)
            {
                newHeight = 1;
            }
            currentHeight = newHeight;
            var corridorHeight = Math.floor(Math.random() * (maxCorridorHeight-minCorridorHeight) + minCorridorHeight);
            
            var block = {floor:newHeight, pos:i, ceil:newHeight + corridorHeight, badGuy: null};
            if(block.floor > 0)
            {
                holeCount = 0;
            }
            else
            {
                block.floor = -11;
                holeCount++;
            }
            

            var badGuyOK = (i > LEVEL_START_SAFE_ZONE && block.floor > 0);
            if(badGuyOK)
            {
                var badGuy = null;
                var badGuyType = Math.floor(Math.random() * 10);
                switch(badGuyType)
                {
                    case 0:
                        badGuy = new Laser(block);
                }
                block.badGuy = badGuy;
            }

            levelData.push(block);



        }
    }

    p.initLevel = function()
    {
        this.levelData = [];
        this.level = new Shape();

        this.generateLevelData(this.levelData);
    }

    p.gameToGraphics = function(p)
    {
        p.x = (p.x-this.offset) * BLOCKSIZE ;
        p.y = canvas.height - p.y*BLOCKSIZE;
    }
    p.graphicsToGame = function(p)
    {
        p.x = p.x/BLOCKSIZE + this.offset;
        p.y = (canvas.height-p.y)/BLOCKSIZE;
    }

    p.drawLevel = function(level)
    {
        var g = level.graphics;
        g.clear();
        g.beginStroke(Graphics.getRGB(0,255,0));
        g.setStrokeStyle(2);
        var blockIndex=0;
        var p =  [new Point(),new Point()];
        var top =  [new Point(),new Point()];
        var c = 0;


        var block= this.levelData[blockIndex];
        p[c].x = blockIndex;
        p[c].y = block.floor;
        top[c].x = blockIndex;
        top[c].y = block.ceil;
        this.gameToGraphics(p[c]);
        this.gameToGraphics(top[c]);
        c = 1-c;


        for(blockIndex=1;blockIndex < 1000;blockIndex++)
        {
            var block = this.levelData[blockIndex];
            p[c].x = blockIndex;
            p[c].y = block.floor;
            top[c].x = blockIndex;
            top[c].y = block.ceil;

            this.gameToGraphics(p[c]);
            this.gameToGraphics(top[c]);
            g.moveTo(p[1-c].x,p[1-c].y);            
            g.lineTo(p[c].x,p[1-c].y);            
            g.lineTo(p[c].x,p[c].y);            

            g.moveTo(top[1-c].x,top[1-c].y);            
            g.lineTo(top[c].x,top[1-c].y);            
            g.lineTo(top[c].x,top[c].y);            
            if(p[c].x > canvas.width)
                break;
            c = 1-c;
        }
    }
    //reset all game logic
    p.restart = function() {
        //hide anything on stage and show the score
        this.stage.removeAllChildren();
        this.resetBadGuys();
        this.initLevel();
        this.drawLevel(this.level);

        this.stage.addChild(this.level);

        this.player = new Player();
        this.playerV = new PlayerV(this.player,BLOCKSIZE);
        this.stage.addChild(this.playerV);
        this.stage.update();

        //reset key presses
        this.forwardHeld = this.backHeld = this.jumpHeld = false;
        this.state = STATE_PLAYING;
        //start game timer
        Ticker.addListener(this);
    }


    p.getPlayerLeftBlock = function(p)
    {
        return this.levelData[Math.floor(p)];
    }
    p.getPlayerRightBlock = function(p)
    {
        var newP = p + this.player.blockWidth;
        if(Math.floor(newP) == newP)
        {
            return this.levelData[Math.floor(newP)-1];
        }
        else
        {
            return this.levelData[Math.floor(newP)];

        }
    }
    p.checkForHorizontalCollisions = function(v)
    {
        var newPos = this.player.position.x + v;
        var leftBlock = this.getPlayerLeftBlock(newPos);
        var rightBlock = this.getPlayerRightBlock(newPos);
        if(v > 0)
        {
            if(rightBlock.floor > this.player.position.y || rightBlock.ceil < (this.player.position.y+this.player.blockHeight))
            {
                newPos = rightBlock.pos-this.player.blockWidth;
            }
        }
        else
        {
            if(leftBlock.floor > this.player.position.y || leftBlock.ceil < (this.player.position.y+this.player.blockHeight))
            {
                newPos = leftBlock.pos+1;
            }

        }
        return newPos;
    }
    p.checkForVerticalCollisionsAgainstBlock = function(newPos,block)
    {
        if(newPos < block.floor)
        {
            newPos = block.floor;
//            console.log("resetting V to ",newPos);
        }
        if(newPos + this.player.blockHeight > block.ceil)
        {
            newPos = block.ceil - this.player.blockHeight;
        }
        return newPos;
    }

    p.checkForVerticalCollisions = function()
    {
        var proposedNewPos = this.player.position.y + this.player.velocity.y;
        var leftBlock = this.getPlayerLeftBlock(this.player.position.x);
        var rightBlock = this.getPlayerRightBlock(this.player.position.x);
        var newPos = proposedNewPos;
        newPos = this.checkForVerticalCollisionsAgainstBlock(newPos,leftBlock);
        newPos = this.checkForVerticalCollisionsAgainstBlock(newPos,rightBlock);
        if(newPos != proposedNewPos)
        {
            this.player.velocity.y = 0;
        }
        return newPos;
    }

    p.updatePlayerPosition = function() {

        if(this.forwardHeld) {
            this.player.velocity.x = Math.min(this.player.velocity.x + LATERAL_VELOCITY,MAX_LATERAL_VELOCITY);
        }
        else if (this.backHeld) {
            this.player.velocity.x = Math.max(this.player.velocity.x - LATERAL_VELOCITY,-MAX_LATERAL_VELOCITY);
        }
        else {
            this.player.velocity.x = this.player.velocity.x * FRICTION;
        }
        this.player.position.x = this.checkForHorizontalCollisions(this.player.velocity.x);


        this.player.velocity.y += GRAVITY;
        this.player.position.y = this.checkForVerticalCollisions();

        this.offset = this.player.position.x - 2;
    }
    p.drawPlayer = function() {
        var playerGPos = new Point(this.player.position.x,this.player.position.y);
        this.gameToGraphics(playerGPos); 
        this.playerV.x = playerGPos.x;
        this.playerV.y = playerGPos.y;
    }

    p.checkForJump = function() {
        if(this.jumpHeld == false)
            return;
    
        if(this.player.velocity.y > 0)
            return;

        var leftBlock = this.getPlayerLeftBlock(this.player.position.x);
        var rightBlock = this.getPlayerRightBlock(this.player.position.x);
        if (this.player.position.y == leftBlock.floor || this.player.position.y == rightBlock.floor)
        {
            this.player.velocity.y = JUMP_VELOCITY;
            SoundJS.play("bounce", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
    }

    p.resetBadGuys = function()
    {
        badGuyInstances = [];
        badGuyCount = 0;    
    }

    
    p.drawBadGuys = function() {
        var firstBlockIndex = Math.floor(this.offset);
        var bottomRight = new Point(canvas.width,canvas.height);
        this.graphicsToGame(bottomRight);
//        var lastBlockindex = Math.floor
        var lastBadGuyCount = badGuyCount;
        badGuyCount = 0;
        for(blockIndex=firstBlockIndex;blockIndex < bottomRight.x;blockIndex++)
        {
            var block = this.levelData[blockIndex];

            if(block == null)
                continue;
            if(block.badGuy == null)
                continue;
            var badGuyInstance = badGuyInstances[badGuyCount];
            if(badGuyInstance == null)
            {
                badGuyInstance = new LaserV(BLOCKSIZE);
                badGuyInstances[badGuyCount] = badGuyInstance;
                stage.addChild(badGuyInstance);
            }
            badGuyCount++;

            badGuyInstance.assign(block.badGuy);
            var badGuyP = new Point(blockIndex,block.floor);
            this.gameToGraphics(badGuyP);
            badGuyInstance.x = badGuyP.x;
            badGuyInstance.y = badGuyP.y;
            block.badGuy.tick(currentTime);         
            badGuyInstance.update();
        }

        for(var i=badGuyCount;i<lastBadGuyCount;i++)
        {
            badGuyInstances[i].assign(null);
        }
    }

    p.die = function()
    {
        this.state = STATE_DYING;        
        var deathSound = SoundJS.play("death", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        var that = this;
        deathSound.onComplete = function() {
            that.restart();
        }

    }
    p.checkForDeath = function()
    {
        var dead = false;
        if(this.player.position.y < -6)
        {
            dead = true;
        }
        if(!dead)
        {
            var leftBlock = this.getPlayerLeftBlock(this.player.position.x);
            var rightBlock = this.getPlayerRightBlock(this.player.position.x);

            if((leftBlock.badGuy && leftBlock.badGuy.canKill(this.player)) ||
                (rightBlock.badGuy && rightBlock.badGuy.canKill(this.player))
                )
            {
                dead = true;
            }
        }
        if (dead)
            this.die();            

    }


    p.tick = function() {
        currentTime = (new Date()).getTime();
        if(this.state == STATE_PLAYING)
        {
            this.checkForJump();
            this.updatePlayerPosition();
            this.checkForDeath();
            this.drawPlayer();
            this.drawLevel(this.level);
            this.drawBadGuys();
        }

        //call sub ticks
        stage.update();
    }

    //allow for WASD and arrow control scheme
    p.handleKeyDown = function(e) {
        //cross browser issues exist
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_SPACE: this.jumpHeld = true; return false;
            case KEYCODE_A:
            case KEYCODE_LEFT:  this.backHeld = true; return false;
            case KEYCODE_D:
            case KEYCODE_RIGHT: this.forwardHeld = true; return false;
//            case KEYCODE_W:
//            case KEYCODE_UP:    fwdHeld = true; return false;
//            case KEYCODE_ENTER:  if(canvas.onclick == handleClick){ handleClick(); }return false;
        }
    }

    p.handleKeyUp = function(e) {
        //cross browser issues exist
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_SPACE: this.jumpHeld = false; break;
            case KEYCODE_A:
            case KEYCODE_LEFT:  this.backHeld = false; break;
            case KEYCODE_D:
            case KEYCODE_RIGHT: this.forwardHeld = false; break;
//            case KEYCODE_W:
//            case KEYCODE_UP:    fwdHeld = false; break;
        }
    }


    handleKeyDown = function(e) {
        gameInstance.handleKeyDown(e);
    }
    handleKeyUp = function(e) {
        gameInstance.handleKeyUp(e);
    }


window.Game = Game;

}(window));