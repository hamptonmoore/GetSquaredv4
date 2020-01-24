export class Render {
    constructor(canvas){
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game){
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let [id, entity] of game.entities){
            // If they have a body lets draw it
            if (entity.components.hasOwnProperty("Body")){
                this.canvas2DContext.fillRect(entity.components["Body"].x * game.scale, entity.components["Body"].y * game.scale, entity.components["Body"].width * game.scale, entity.components["Body"].height * game.scale);
            }
        }
    }
}

export class CharacterController2D {
    constructor(){

    }

    run(game){
        for (let [id, entity] of game.entities){
            // Only run if they have a CharacterController
            if (entity.components.hasOwnProperty("CharacterController2D")){
                let CharacterController2D = entity.components["CharacterController2D"];
                console.log(entity)
                if (entity.components.hasOwnProperty("Velocity")){
                    let Velocity = entity.components["Velocity"];

                    if (CharacterController2D.keys["KeyW"]){
                        if (Velocity.yMomentum > 0){
                            Velocity.yMomentum = -CharacterController2D.acceleration;;
                        } else {
                            Velocity.yMomentum -= CharacterController2D.acceleration;
                        }
                    }
                    if (CharacterController2D.keys["KeyS"]){
                        if (Velocity.yMomentum < 0){
                            Velocity.yMomentum = CharacterController2D.acceleration;
                        } else {
                            Velocity.yMomentum += CharacterController2D.acceleration;
                        }

                    }
                    if (CharacterController2D.keys["KeyA"]){
                        if (Velocity.xMomentum > 0) {
                            Velocity.xMomentum = -CharacterController2D.acceleration;
                        } else {
                            Velocity.xMomentum -= CharacterController2D.acceleration;
                        }
                    }
                    if (CharacterController2D.keys["KeyD"]){
                        if (Velocity.xMomentum < 0) {
                            Velocity.xMomentum = CharacterController2D.acceleration;
                        } else {
                            Velocity.xMomentum += CharacterController2D.acceleration;
                        }
                    }

                } else if (entity.components.hasOwnProperty("Body")){
                    let Body = entity.components["Body"];

                    if (CharacterController2D.keys["KeyW"]){
                        Body.y -= CharacterController2D.acceleration;
                    }
                    if (CharacterController2D.keys["KeyS"]){
                        Body.y += CharacterController2D.acceleration;
                    }
                    if (CharacterController2D.keys["KeyA"]){
                        Body.x -= CharacterController2D.acceleration;
                    }
                    if (CharacterController2D.keys["KeyD"]){
                        Body.x += CharacterController2D.acceleration;
                    }
                }
            }
        }
    }
}

export class Velocity {
    constructor(){

    }

    run(game) {
        for (let [id, entity] of game.entities) {
            // Only run if they have a CharacterController
            if (entity.components.hasOwnProperty("Velocity") && entity.components.hasOwnProperty("Body")) {
                let Velocity = entity.components["Velocity"];
                let Body = entity.components["Body"];

                // If xMomentum is great than it limit set it to the limit
                Velocity.xMomentum = Velocity.xMomentum > Velocity.maxXMomentum? Velocity.maxXMomentum : Velocity.xMomentum;
                Velocity.xMomentum = Velocity.xMomentum < -Velocity.maxXMomentum? -Velocity.maxXMomentum : Velocity.xMomentum;
                // Equally with the yMomentum
                Velocity.yMomentum = Velocity.yMomentum > Velocity.maxYMomentum? Velocity.maxYMomentum : Velocity.yMomentum;
                Velocity.yMomentum = Velocity.yMomentum < -Velocity.maxYMomentum? -Velocity.maxYMomentum : Velocity.yMomentum;

                Body.x += Velocity.xMomentum;
                Body.y += Velocity.yMomentum;

                Velocity.xMomentum *= Velocity.baseFriction;
                Velocity.yMomentum *= Velocity.baseFriction;
            }
        }
    }
}

/*
The role of this system is to go through the keypress buffer (game.keys) and pass those inputs to components which use keypress
 */
export class ClientHandleInputs {
    constructor(componentsThatAcceptInputs){
        this.componentsThatAcceptInputs = componentsThatAcceptInputs;
    }

    run(game) {
        for (let keys of game.keys) {
            for (let entity of game.entities.values()) {
                for (let i in entity.components) {
                    let component = entity.components[i];
                    if (this.componentsThatAcceptInputs.includes(component.name)) {
                        if (component.keys.hasOwnProperty(keys.code)) {
                            component.keys[keys.code] = keys.state;
                            //console.log(`${keys.code} changed to state ${keys.state} on component ${component.name} for entity ${entity.id}`);
                        }
                    }
                }
            }
        }

        game.keys = [];
    }
}