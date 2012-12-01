
    
    
    function init() {
        if (window.top != window) {
            document.getElementById("header").style.display = "none";
        }

        if (!SoundJS.checkPlugin(true)) {
//            document.getElementById("error").style.display = "block";
//            document.getElementById("content").style.display = "none";
            return;
        }



        canvas = document.getElementById("gameCanvas");
        stage = new Stage(canvas);
        game = new Game(stage);
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
        preload.loadManifest(game.manifest);
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

        game.start();
    }


