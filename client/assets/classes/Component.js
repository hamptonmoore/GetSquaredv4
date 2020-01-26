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

        this.shape       = shape;
        this.stroke      = stroke;
        this.fill        = fill;
        this.strokeWidth = strokeWidth;
        this.name        = "AppearanceShape";
    }
}

export class Player {
    constructor(playerName){
        // noinspection JSUnusedGlobalSymbols
        this.points = 0;
        this.playerName = playerName;
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
        // noinspection JSUnusedGlobalSymbols
        this.target = null;
        this.name     = "BotControl";
    }
}