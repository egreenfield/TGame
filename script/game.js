
    var KEYCODE_ENTER = 13;     //usefull keycode
    var KEYCODE_SPACE = 32;     //usefull keycode
    var KEYCODE_UP = 38;        //usefull keycode
    var KEYCODE_LEFT = 37;      //usefull keycode
    var KEYCODE_RIGHT = 39;     //usefull keycode
    var KEYCODE_W = 87;         //usefull keycode
    var KEYCODE_A = 65;         //usefull keycode
    var KEYCODE_D = 68;         //usefull keycode



    var forwardHeld;
    var backHeld;
    var jumpHeld;
    var playerHeight;
    var playerPosition; 
    var preload;

    var canvas;         //Main canvas
    var stage;          //Main display stage

    var playerVerticalVelocity = 0;
    var playerHorizontalVelocity = 0;



    var messageField;       //Message display field
    var scoreField;         //score Field

    var loadingInterval = 0;

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
    var state = STATE_PLAYING;


    //register key functions
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;


    function init() {
        if (window.top != window) {
            document.getElementById("header").style.display = "none";
        }

        if (!SoundJS.checkPlugin(true)) {
//            document.getElementById("error").style.display = "block";
//            document.getElementById("content").style.display = "none";
            return;
        }

        // begin loading content (only sounds to load)
        var manifest = [
            {id:"music", src:"assets/music.mp3"}
            ,{id:"bounce", src:"assets/bounce.mp3"}
            ,{id:"pew", src:"assets/pew.mp3"}
            ,{id:"death", src:"assets/death.mp3"}
            /*,{id:"break", src:"assets/Game-Break.mp3|../../assets/Game-Break.ogg", data:6},
            {id:"death", src:"assets/Game-Death.mp3|../../assets/Game-Death.ogg"},
            {id:"laser", src:"assets/Game-Shot.mp3|../../assets/Game-Shot.ogg", data:6},
            {id:"music", src:"assets/18-machinae_supremacy-lord_krutors_dominion.mp3|../../assets/18-machinae_supremacy-lord_krutors_dominion.ogg"}
            */
        ];


        canvas = document.getElementById("gameCanvas");
        stage = new Stage(canvas);
        messageField = new Text("Loading", "bold 24px Arial", "#000000");
        messageField.maxWidth = 1000;
        messageField.textAlign = "center";
        messageField.x = canvas.width / 2;
        messageField.y = canvas.height / 2;
        stage.addChild(messageField);
        stage.update();     //update the stage to show text

        loadingInterval = setInterval(updateLoading, 200);

        preload = new PreloadJS();
        preload.onComplete = doneLoading;
        preload.installPlugin(SoundJS);
        preload.loadManifest(manifest);
    }

    function stop() {
        if (preload != null) { preload.close(); }
        SoundJS.stop();
    }

    function updateLoading() {
        messageField.text = "Loading " + (preload.progress*100|0) + "%"
        stage.update();
    }


    function doneLoading() {
        clearInterval(loadingInterval);
        scoreField = new Text("0", "bold 12px Arial", "#000000");
        scoreField.textAlign = "right";
        scoreField.x = canvas.width - 10;
        scoreField.y = 22;
        scoreField.maxWidth = 1000;
        messageField.text = "Welcome:  Click to play";

        // start the music
        //SoundJS.play("music", SoundJS.INTERRUPT_NONE, 0, 0, -1, 0.1);

        watchRestart();
    }

    function watchRestart() {
        //watch for clicks
        stage.addChild(messageField);
        stage.update();     //update the stage to show text
        canvas.onclick = handleClick;
    }

    function handleClick() {
        //prevent extra clicks and hide text
        canvas.onclick = null;
        stage.removeChild(messageField);

        // indicate the player is now on screen
        SoundJS.play("begin");

        restart();
    }

    function generateLevelData(levelData)
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
                        badGuy = DeathTrap.generate(block);
                }
                block.badGuy = badGuy;
            }

            levelData.push(block);



        }
    }

    function initLevel()
    {
        levelData = [];
        level = new Shape();

        generateLevelData(levelData);
    }

    function gameToGraphics(p)
    {
        p.x = (p.x-offset) * BLOCKSIZE ;
        p.y = canvas.height - p.y*BLOCKSIZE;
    }
    function graphicsToGame(p)
    {
        p.x = p.x/BLOCKSIZE + offset;
        p.y = (canvas.height-p.y)/BLOCKSIZE;
    }

    var offset = 0;
    function drawLevel(level)
    {
        var g = level.graphics;
        g.clear();
        g.beginStroke(Graphics.getRGB(0,255,0));
        g.setStrokeStyle(2);
        var blockIndex=0;
        var p =  [new Point(),new Point()];
        var top =  [new Point(),new Point()];
        var c = 0;


        var block= levelData[blockIndex];
        p[c].x = blockIndex;
        p[c].y = block.floor;
        top[c].x = blockIndex;
        top[c].y = block.ceil;
        gameToGraphics(p[c]);
        gameToGraphics(top[c]);
        c = 1-c;


        for(blockIndex=1;blockIndex < 1000;blockIndex++)
        {
            var block = levelData[blockIndex];
            p[c].x = blockIndex;
            p[c].y = block.floor;
            top[c].x = blockIndex;
            top[c].y = block.ceil;

            gameToGraphics(p[c]);
            gameToGraphics(top[c]);
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
    function restart() {
        //hide anything on stage and show the score
        stage.removeAllChildren();
        resetBadGuys();
        initLevel();
        drawLevel(level);

        stage.addChild(level);

        player = new Player(BLOCKSIZE);
        stage.addChild(player);
        stage.update();

        scoreField.text = (0).toString();
        stage.addChild(scoreField);

        playerPosition = new Point(0,levelData[0].floor);

        //reset key presses
        forwardHeld = backHeld = jumpHeld = false;


        state = STATE_PLAYING;

        //start game timer
        Ticker.addListener(window);
    }
    function getPlayerLeftBlock(p)
    {
        return levelData[Math.floor(p)];
    }
    function getPlayerRightBlock(p)
    {
        var newP = p + player.blockWidth;
        if(Math.floor(newP) == newP)
        {
            return levelData[Math.floor(newP)-1];
        }
        else
        {
            return levelData[Math.floor(newP)];

        }
    }
    function checkForHorizontalCollisions(v)
    {
        var newPos = playerPosition.x + v;
        var leftBlock = getPlayerLeftBlock(newPos);
        var rightBlock = getPlayerRightBlock(newPos);
        if(v > 0)
        {
            if(rightBlock.floor > playerPosition.y || rightBlock.ceil < (playerPosition.y+player.blockHeight))
            {
                newPos = rightBlock.pos-player.blockWidth;
            }
        }
        else
        {
            if(leftBlock.floor > playerPosition.y || leftBlock.ceil < (playerPosition.y+player.blockHeight))
            {
                newPos = leftBlock.pos+1;
            }

        }
        return newPos;
    }
    function checkForVerticalCollisionsAgainstBlock(newPos,block)
    {
        if(newPos < block.floor)
        {
            newPos = block.floor;
//            console.log("resetting V to ",newPos);
        }
        if(newPos + player.blockHeight > block.ceil)
        {
            newPos = block.ceil - player.blockHeight;
        }
        return newPos;
    }

    function checkForVerticalCollisions()
    {
        var proposedNewPos = playerPosition.y + playerVerticalVelocity;
        var leftBlock = getPlayerLeftBlock(playerPosition.x);
        var rightBlock = getPlayerRightBlock(playerPosition.x);
        var newPos = proposedNewPos;
        newPos = checkForVerticalCollisionsAgainstBlock(newPos,leftBlock);
        newPos = checkForVerticalCollisionsAgainstBlock(newPos,rightBlock);
        if(newPos != proposedNewPos)
        {
            playerVerticalVelocity = 0;
        }
        return newPos;
    }

    function updatePlayerPosition() {

        if(forwardHeld) {
            playerHorizontalVelocity = Math.min(playerHorizontalVelocity + LATERAL_VELOCITY,MAX_LATERAL_VELOCITY);
        }
        else if (backHeld) {
            playerHorizontalVelocity = Math.max(playerHorizontalVelocity - LATERAL_VELOCITY,-MAX_LATERAL_VELOCITY);
        }
        else {
            playerHorizontalVelocity = playerHorizontalVelocity * FRICTION;
        }
        playerPosition.x = checkForHorizontalCollisions(playerHorizontalVelocity);


        playerVerticalVelocity += GRAVITY;
        playerPosition.y = checkForVerticalCollisions();
//        playerPosition.y += playerVerticalVelocity;

//        checkForPlayerCollisions();
        offset = playerPosition.x - 2;
    }
    function drawPlayer() {
        var playerGPos = new Point(playerPosition.x,playerPosition.y);
        gameToGraphics(playerGPos); 
        player.x = playerGPos.x;
        player.y = playerGPos.y;
    }

    function checkForJump() {
        if(jumpHeld == false)
            return;
    
        if(playerVerticalVelocity > 0)
            return;

        var leftBlock = getPlayerLeftBlock(playerPosition.x);
        var rightBlock = getPlayerRightBlock(playerPosition.x);
        if (playerPosition.y == leftBlock.floor || playerPosition.y == rightBlock.floor)
        {
            playerVerticalVelocity = JUMP_VELOCITY;
            SoundJS.play("bounce", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        }
    }

    function resetBadGuys()
    {
        badGuyInstances = [];
        badGuyCount = 0;    
    }

    
    function drawBadGuys() {
        var firstBlockIndex = Math.floor(offset);
        var bottomRight = new Point(canvas.width,canvas.height);
        graphicsToGame(bottomRight);
//        var lastBlockindex = Math.floor
        var lastBadGuyCount = badGuyCount;
        badGuyCount = 0;
        for(blockIndex=firstBlockIndex;blockIndex < bottomRight.x;blockIndex++)
        {
            var block = levelData[blockIndex];

            if(block == null)
                continue;
            if(block.badGuy == null)
                continue;
            var badGuyInstance = badGuyInstances[badGuyCount];
            if(badGuyInstance == null)
            {
                badGuyInstance = new DeathTrap(BLOCKSIZE);
                badGuyInstances[badGuyCount] = badGuyInstance;
                stage.addChild(badGuyInstance);
            }
            badGuyCount++;

            badGuyInstance.assign(block.badGuy);
            var badGuyP = new Point(blockIndex,block.floor);
            gameToGraphics(badGuyP);
            badGuyInstance.x = badGuyP.x;
            badGuyInstance.y = badGuyP.y;
            badGuyInstance.tick(currentTime);         
        }

        for(var i=badGuyCount;i<lastBadGuyCount;i++)
        {
            badGuyInstances[i].assign(null);
        }
    }

    function die()
    {
        state = STATE_DYING;        
        var deathSound = SoundJS.play("death", SoundJS.INTERRUPT_NONE, 0, 0, 0, 1);
        var that = this;
        deathSound.onComplete = function() {
            that.restart();
        }

    }
    function checkForDeath()
    {
        var dead = false;
        if(playerPosition.y < -6)
        {
            dead = true;
        }
        if(!dead)
        {
            var leftBlock = getPlayerLeftBlock(playerPosition.x);
            var rightBlock = getPlayerRightBlock(playerPosition.x);

            if((leftBlock.badGuy && leftBlock.badGuy.active) ||
                (rightBlock.badGuy && rightBlock.badGuy.active)
                )
            {
                dead = true;
            }
        }
        if (dead)
            die();            

    }


    function tick() {
        currentTime = (new Date()).getTime();
        if(state == STATE_PLAYING)
        {
            checkForJump();
            updatePlayerPosition();
            checkForDeath();
        }
        drawPlayer();
        drawLevel(level);
        drawBadGuys();

        //call sub ticks
        stage.update();
    }

    //allow for WASD and arrow control scheme
    function handleKeyDown(e) {
        //cross browser issues exist
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_SPACE: jumpHeld = true; return false;
            case KEYCODE_A:
            case KEYCODE_LEFT:  backHeld = true; return false;
            case KEYCODE_D:
            case KEYCODE_RIGHT: forwardHeld = true; return false;
//            case KEYCODE_W:
//            case KEYCODE_UP:    fwdHeld = true; return false;
//            case KEYCODE_ENTER:  if(canvas.onclick == handleClick){ handleClick(); }return false;
        }
    }

    function handleKeyUp(e) {
        //cross browser issues exist
        if(!e){ var e = window.event; }
        switch(e.keyCode) {
            case KEYCODE_SPACE: jumpHeld = false; break;
            case KEYCODE_A:
            case KEYCODE_LEFT:  backHeld = false; break;
            case KEYCODE_D:
            case KEYCODE_RIGHT: forwardHeld = false; break;
//            case KEYCODE_W:
//            case KEYCODE_UP:    fwdHeld = false; break;
        }
    }

    function addScore(value) {
        //trust the field will have a number and add the score
        scoreField.text = (Number(scoreField.text) + Number(value)).toString();
    }