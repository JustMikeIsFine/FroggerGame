class Game {
    constructor(state) {
        this.firstPerson = false;
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.movement = 1.5;
        this.finished = 0;
        this.car1x = 3.6;
        this.car2x = -2.6;
        this.logx = -0.8;
    }

    // runs once on startup after the scene loads the objects
    async onStart() {
        console.log("On start");
        

        // this just prevents the context menu from popping up when you right click
        document.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        }, false);

        // example - set an object in onStart before starting our render loop!
        this.cube = getObject(this.state, "frog");
        this.cube.model.position = vec3.fromValues(0, 0.25, -0.25);
        this.log = getObject(this.state, "log");
        this.log.model.position = vec3.fromValues(0.5, 0.4, 2.5);
        this.state.camera.position = vec3.fromValues(0, 4, 0);
        this.state.camera.front = vec3.fromValues(0, -1, 1);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keypress", (e) => {
            e.preventDefault();

            switch (e.key) {
                case "a":
                    if(this.finished == 0) { this.cube.translate(vec3.fromValues(0.15, 0, 0));}
                    break;
                case "d":
                    if(this.finished == 0) {this.cube.translate(vec3.fromValues(-0.15, 0, 0));}
                    break;
                case "w":
                    if(this.finished == 0) {this.cube.translate(vec3.fromValues(0, 0, 0.15));}
                    break;
                case "s":
                    if(this.finished == 0) {this.cube.translate(vec3.fromValues(0, 0, -0.15));}
                    break;
                case "r":
                    this.cube.model.position = vec3.fromValues(0, 0.25, -0.25);
                    this.finished = 0;
                    break;
                case "c":
                    if(this.firstPerson){this.firstPerson = false}else{ this.firstPerson = true}
                default:
                    break;
            }
        });   
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions

        
        if(this.finished == 0)
        {
            this.moveCar1(deltaTime);
            this.moveCar2(deltaTime);
            this.moveLog(deltaTime);
            this.swapPOV();
            this.winCondition();
            this.loseCondition();
            this.wallColision();
        }
        
        
    }

    moveCar1(deltaTime)
    {
        this.c1 = getObject(this.state, "car1");  
        this.c1.translate(vec3.fromValues(-2.5* deltaTime, 0, 0) );
        this.car1x = this.car1x + (-2.5* deltaTime)
        
        if(this.c1.model.position[0] < -3)
        {
            this.c1.model.position = vec3.fromValues(3.5, -0.5, 4.5);
            this.car1x = 3.6;
        }
    }

    moveCar2(deltaTime)
    {
        this.c2 = getObject(this.state, "car2");
        this.c2.translate(vec3.fromValues(2* deltaTime, 0, 0) );
        this.car2x = this.car2x + (2* deltaTime)
        
        if(this.c2.model.position[0] > 4)
        {
            this.c2.model.position = vec3.fromValues(-2.5, -0.5, 1.7999999523162842);
            this.car2x = -2.6;
        }
    }

    moveLog(deltaTime)
    {
        
        this.log = getObject(this.state, "log");
        this.log.translate(vec3.fromValues(this.movement* deltaTime, 0, 0) );
        this.logx = this.logx + (this.movement* deltaTime)
        if(this.log.model.position[0] > 3)
        {
            this.movement = -1.5;
        }
        else if(this.log.model.position[0] < -3)
        {
            this.movement = 1.5;
        }

        this.frog = getObject(this.state, "frog");
        if(this.frog.model.position[2] >= 1.8 && this.frog.model.position[2] <= 2.7 &&
            (this.frog.model.position[0] <= this.logx + 2.4 || 
            this.frog.model.position[0] >= this.logx))
        {
            this.frog.translate(vec3.fromValues(this.movement* deltaTime, 0, 0));
        }
    }

    winCondition()
    {
        this.frog = getObject(this.state, "frog");
        if(this.frog.model.position[2] > 4.35)
        {
            console.log("YOU WIN!!!");
            this.finished = 1;
        }
    }

    loseCondition()
    {
        this.frog = getObject(this.state, "frog");
        if(this.frog.model.position[2] >= 0.3 && this.frog.model.position[2] <= 1.3 &&
            this.frog.model.position[0] <= this.car2x && 
            this.frog.model.position[0] >= this.car2x - 1.1)
        {
            console.log("GAME OVER");
            this.finished = 1;
        }
        else if(this.frog.model.position[2] >= 3.2 && this.frog.model.position[2] <= 4.1 &&
            this.frog.model.position[0] <= this.car1x && 
            this.frog.model.position[0] >= this.car1x - 1.1)
        {
            console.log("GAME OVER");
            this.finished = 1;
        }
        else if(this.frog.model.position[2] >= 1.8 && this.frog.model.position[2] <= 2.7 &&
            (this.frog.model.position[0] >= this.logx + 2.4 || 
            this.frog.model.position[0] <= this.logx))
        {
            console.log("GAME OVER");
            this.finished = 1;
        }
    }
    
    swapPOV()
    {
        if(this.firstPerson)
        {
          console.log(this.state.camera);
          this.frog = getObject(this.state, "frog");
          this.state.camera.position = vec3.fromValues(this.frog.model.position[0]+0.25, this.frog.model.position[1]+0.25, this.frog.model.position[2]+0.5);
          this.state.camera.front = vec3.fromValues(0, 0, 1);
        }
        else
        {
            this.state.camera.position = vec3.fromValues(0, 4, 0);
            this.state.camera.front = vec3.fromValues(0, -1, 1);
        }
    }

    wallColision()
    {
        this.frog = getObject(this.state, "frog");
        if (this.frog.model.position[0] >= 3.7)
        {
            this.cube.translate(vec3.fromValues(-0.15, 0, 0));
        }
        else if (this.frog.model.position[0] <= -3.7)
        {
            this.cube.translate(vec3.fromValues(0.15, 0, 0));
        }
        else if (this.frog.model.position[2] >= 4.5)
        {
            this.cube.translate(vec3.fromValues(0, 0, -0.15));
        }
        else if (this.frog.model.position[2] <= 0)
        {
            this.cube.translate(vec3.fromValues(0, 0, 0.15));
        }
    }
}
