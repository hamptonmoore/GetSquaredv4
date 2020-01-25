export class Body {
    constructor(x, y, width, height){
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.name   = "Body";
    }
}

export class Velocity {
    constructor(xMomentum, yMomentum, maxXMomentum, maxYMomentum, baseFriction){
       // noinspection JSUnusedGlobalSymbols
        this.xMomentum          = xMomentum;
       // noinspection JSUnusedGlobalSymbols
        this.yMomentum          = yMomentum;
       this.maxXMomentum       = maxXMomentum;
       this.maxYMomentum       = maxYMomentum;
       this.baseFriction       = baseFriction;
       this.name               = "Velocity";
    }
}

export class CharacterController2D {
    constructor(acceleration){
        this.acceleration = acceleration;
        this.keys = {
            "KeyW": false,
            "KeyA": false,
            "KeyS": false,
            "KeyD": false
        };

        this.name = "CharacterController2D";
    }
}

export class Marker {
    constructor(owner, timestamp){
        this.owner            = owner;
        this.timestamp        = timestamp;
        this.rectangleOfDeath = null;
        this.name             = "Marker"
    }
}

export class LocalPlayer {
    constructor(){
        this.name = "LocalPlayer";
    }
}

export class MarkerSummoner {
    constructor(){
        this.keys = {
            "Space": false
        };

        // noinspection JSUnusedGlobalSymbols
        this.firstMarkerID  = null;
        // noinspection JSUnusedGlobalSymbols
        this.secondMarkerID = null;

        this.name = "MarkerSummoner";
    }
}

export class AppearanceShape {
    constructor(shape, fill, stroke, strokeWidth){
        let possibleShapes = ["filledRect", "roundedFilledRect"];

        if (!possibleShapes.includes(shape)){
            throw `The provided shape of ${shape} is invalid`;
        }

        if (fill === "random"){
            fill = this.randomColor();
        }

        this.shape       = shape;
        this.stroke      = stroke;
        this.fill        = fill;
        this.strokeWidth = strokeWidth;
        this.name        = "AppearanceShape";
    }

    randomColor(){
        var h = this.randomInterger(0, 360);
        var s = this.randomInterger(42, 98);
        var l = this.randomInterger(40, 90);
        return `hsl(${h},${s}%,${l}%)`;
    }

    randomInterger = function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}

export class Player {
    constructor(){
        // noinspection JSUnusedGlobalSymbols
        this.points = 0;
        this.name   = "Player";
    }
}

export class RectangleOfDeath {
    constructor(owner){
        this.owner = owner;
        this.name  = "RectangleOfDeath"
    }
}

export class PlayerRespawn {
    constructor(){
        this.name  = "PlayerRespawn"
    }
}

export class BotControl {
    constructor(){
        this.target = null;
        this.name     = "BotControl";
    }
}