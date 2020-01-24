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
       this.xMomentum          = xMomentum;
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