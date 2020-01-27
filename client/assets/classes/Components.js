export function Body (x, y, width, height){
        this.x      = x;
        this.y      = y;
        this.width  = width;
        this.height = height;
        this.name   = "Body";
}

export function Velocity (xMomentum, yMomentum, maxXMomentum, maxYMomentum, baseFriction){
       // noinspection JSUnusedGlobalSymbols
        this.xMomentum          = xMomentum;
       // noinspection JSUnusedGlobalSymbols
        this.yMomentum          = yMomentum;
       this.maxXMomentum       = maxXMomentum;
       this.maxYMomentum       = maxYMomentum;
       this.baseFriction       = baseFriction;
       this.name               = "Velocity";
}

export function CharacterController2D (acceleration){
        this.acceleration = acceleration;
        this.KeyW = false;
        this.KeyA = false;
        this.KeyS = false;
        this.KeyD = false;

        this.name = "CharacterController2D";
}

export function Marker (owner, timestamp){
        this.owner            = owner;
        this.timestamp        = timestamp;
        this.rectangleOfDeath = null;
        this.name             = "Marker"
}

export function LocalPlayer (){
        this.name = "LocalPlayer";
}

export function MarkerSummoner (){
        this.Space = false;

        // noinspection JSUnusedGlobalSymbols
        this.firstMarkerID  = null;
        // noinspection JSUnusedGlobalSymbols
        this.secondMarkerID = null;

        this.name = "MarkerSummoner";
}

export function AppearanceShape (shape, fill, stroke, strokeWidth){
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

export function Player (playerName){
        // noinspection JSUnusedGlobalSymbols
        this.points = 0;
        this.playerName = playerName;
        this.name   = "Player";
}

export function RectangleOfDeath (owner){
        this.owner = owner;
        this.name  = "RectangleOfDeath"
}

export function PlayerRespawn (){
        this.name  = "PlayerRespawn"
}

export function BotControl (){
        // noinspection JSUnusedGlobalSymbols
        this.target = null;
        this.name     = "BotControl";
}