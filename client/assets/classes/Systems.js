import {Entity} from "./Entity.js";
import * as Components from "./Components.js";

export class Render {
    constructor(canvas){
        this.canvas          = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game){
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let entity of game.entities.values()){
            // If they have a body lets draw it
            if (entity.components.hasOwnProperty("Body")) {

                if (entity.components.hasOwnProperty("AppearanceShape")) {
                    let AppearanceShape = entity.components["AppearanceShape"];
                    let Body = entity.components["Body"];

                    this.canvas2DContext.fillStyle   = AppearanceShape.fill;
                    this.canvas2DContext.strokeStyle = AppearanceShape.stroke;
                    this.canvas2DContext.lineWidth   = AppearanceShape.strokeWidth * game.scale;

                    if (AppearanceShape.shape === "filledRect") {

                        this.canvas2DContext.fillRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale);
                        this.canvas2DContext.strokeRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale);
                    } else if (AppearanceShape.shape === "roundedFilledRect") {
                        this.roundRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale, 10 );
                        this.canvas2DContext.fill();
                        this.canvas2DContext.stroke();
                    }

                }
            }
        }
    }

    roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.canvas2DContext.beginPath();
        this.canvas2DContext.moveTo(x+r, y);
        this.canvas2DContext.arcTo(x+w, y,   x+w, y+h, r);
        this.canvas2DContext.arcTo(x+w, y+h, x,   y+h, r);
        this.canvas2DContext.arcTo(x,   y+h, x,   y,   r);
        this.canvas2DContext.arcTo(x,   y,   x+w, y,   r);
        this.canvas2DContext.closePath();
    }
}

export class MarkerSummoner {
    constructor(props) {

    }

    run(game){
        for (let [id, entity] of game.entities){
            if (entity.components.hasOwnProperty("Body") && entity.components.hasOwnProperty("MarkerSummoner")){
                let Body           = entity.components["Body"];
                let MarkerSummoner = entity.components["MarkerSummoner"];

                if (MarkerSummoner.keys["Space"]){
                    let Marker = new Entity([
                        new Components.Body(Body.x + 2.5, Body.y + 2.5, 10, 10),
                        new Components.AppearanceShape("roundedFilledRect", "blue", "black", 2),
                        new Components.Marker(id, Date.now())
                    ]);

                    game.entities.set(Marker.id, Marker);

                    if (MarkerSummoner.firstMarkerID == null){
                        MarkerSummoner.firstMarkerID = Marker.id;
                    } else if (MarkerSummoner.secondMarkerID == null){
                        MarkerSummoner.secondMarkerID = Marker.id;
                    } else {
                        game.entities.delete(game.entities.get(MarkerSummoner.firstMarkerID).components["Marker"].rectangleOfDeath);
                        game.entities.delete(MarkerSummoner.firstMarkerID);
                        MarkerSummoner.firstMarkerID = MarkerSummoner.secondMarkerID;
                        MarkerSummoner.secondMarkerID = Marker.id;
                    }

                    if (MarkerSummoner.firstMarkerID != null && MarkerSummoner.secondMarkerID != null){
                        let rectangleOfDeath = this.createRectangleOfDeath(game.entities.get(MarkerSummoner.firstMarkerID), game.entities.get(MarkerSummoner.secondMarkerID));

                        game.entities.get(MarkerSummoner.firstMarkerID).components["Marker"].rectangleOfDeath = rectangleOfDeath.id;
                        game.entities.get(MarkerSummoner.secondMarkerID).components["Marker"].rectangleOfDeath = rectangleOfDeath.id;

                        game.entities.set(rectangleOfDeath.id, rectangleOfDeath);
                        console.log("Created ROD")
                    }

                    MarkerSummoner.keys["Space"] = false;
                }
            }
        }
    }

    // noinspection JSMethodCanBeStatic
    createRectangleOfDeath(firstMarker, secondMarker){
        let firstMarkerBody = firstMarker.components["Body"];
        let secondMarkerBody = secondMarker.components["Body"];

        // lets get the lowest x and y cordinate out of the two
        let xPosition = Math.min(firstMarkerBody.x, secondMarkerBody.x) + firstMarkerBody.width/2;
        let yPosition = Math.min(firstMarkerBody.y, secondMarkerBody.y) + firstMarkerBody.width/2;

        // This is where it gets spicy, finding the width and height
        let width = Math.max(firstMarkerBody.x, secondMarkerBody.x) - xPosition + firstMarkerBody.width/2;
        let height = Math.max(firstMarkerBody.y, secondMarkerBody.y) - yPosition + firstMarkerBody.width/2;

        // Lets put this all together and make the rectangleOfDeath
        return new Entity([
            new Components.Body(xPosition, yPosition, width, height),
            new Components.AppearanceShape("roundedFilledRect", "red", "black", 2)
        ]);

    }
}

export class CharacterController2D {
    constructor(){

    }

    // noinspection JSMethodCanBeStatic
    run(game){
        for (let entity of game.entities.values()){
            // Only run if they have a CharacterController
            if (entity.components.hasOwnProperty("CharacterController2D")){
                let CharacterController2D = entity.components["CharacterController2D"];

                if (entity.components.hasOwnProperty("Velocity")){
                    let Velocity = entity.components["Velocity"];

                    if (CharacterController2D.keys["KeyW"]){
                        if (Velocity.yMomentum > 0){
                            Velocity.yMomentum = -CharacterController2D.acceleration;
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

    // noinspection JSMethodCanBeStatic
    run(game) {
        for (let entity of game.entities.values()) {
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
                for (let component of Object.values(entity.components)) {
                    //let component = entity.components[i];
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