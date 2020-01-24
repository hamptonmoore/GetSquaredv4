import {Entity} from "./Entity.js";
import * as Component from "./Component.js";

export class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game) {
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        game.ComponentStore.getAllComponentsOfComponentType("Body").forEach((Body, entityID) => {
            if (game.ComponentStore.entityHasComponent("AppearanceShape", entityID)) {
                let AppearanceShape = game.ComponentStore.entityGetComponent("AppearanceShape", entityID);

                this.canvas2DContext.fillStyle = AppearanceShape.fill;
                this.canvas2DContext.strokeStyle = AppearanceShape.stroke;
                this.canvas2DContext.lineWidth = AppearanceShape.strokeWidth * game.scale;

                if (AppearanceShape.shape === "filledRect") {
                    this.canvas2DContext.fillRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale);
                    this.canvas2DContext.strokeRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale);
                } else if (AppearanceShape.shape === "roundedFilledRect") {
                    this.roundRect(Body.x * game.scale, Body.y * game.scale, Body.width * game.scale, Body.height * game.scale, 10);
                    this.canvas2DContext.fill();
                    this.canvas2DContext.stroke();
                }

            }
        })
    }

    roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.canvas2DContext.beginPath();
        this.canvas2DContext.moveTo(x + r, y);
        this.canvas2DContext.arcTo(x + w, y, x + w, y + h, r);
        this.canvas2DContext.arcTo(x + w, y + h, x, y + h, r);
        this.canvas2DContext.arcTo(x, y + h, x, y, r);
        this.canvas2DContext.arcTo(x, y, x + w, y, r);
        this.canvas2DContext.closePath();
    }
}

export class MarkerSummoner {
    constructor(props) {

    }

    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("MarkerSummoner").forEach((MarkerSummoner, entityID) => {
            // If it doesnt have a body or space isnt being held then return
            if (!(game.ComponentStore.entityHasComponent("Body", entityID) && MarkerSummoner.keys["Space"])) {
                return;
            }

            let Body = game.ComponentStore.entityGetComponent("Body", entityID);
            let Marker = new Entity([
                new Component.Body(Body.x + 2.5, Body.y + 2.5, 10, 10),
                new Component.AppearanceShape("roundedFilledRect", "blue", "black", 2),
                new Component.Marker(entityID, Date.now())
            ]);

            game.ComponentStore.addEntity(Marker);

            if (MarkerSummoner.firstMarkerID == null) {
                MarkerSummoner.firstMarkerID = Marker.id;
            } else if (MarkerSummoner.secondMarkerID == null) {
                MarkerSummoner.secondMarkerID = Marker.id;
            } else {
                game.ComponentStore.deleteEntity(game.ComponentStore.entityGetComponent("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath);
                game.ComponentStore.deleteEntity(MarkerSummoner.firstMarkerID);
                MarkerSummoner.firstMarkerID = MarkerSummoner.secondMarkerID;
                MarkerSummoner.secondMarkerID = Marker.id;
            }
            if (MarkerSummoner.firstMarkerID != null && MarkerSummoner.secondMarkerID != null) {
                let rectangleOfDeath = this.createRectangleOfDeath(
                    game.ComponentStore.entityGetComponent("Body", MarkerSummoner.firstMarkerID),
                    game.ComponentStore.entityGetComponent("Body", MarkerSummoner.secondMarkerID)
                );

                game.ComponentStore.entityGetComponent("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath = rectangleOfDeath.id;
                game.ComponentStore.entityGetComponent("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath = rectangleOfDeath.id;

                game.ComponentStore.addEntity(rectangleOfDeath);
                console.log("Created ROD")
            }
            MarkerSummoner.keys["Space"] = false;
        })
    }

    // noinspection JSMethodCanBeStatic
    createRectangleOfDeath(firstMarkerBody, secondMarkerBody) {

        // lets get the lowest x and y cordinate out of the two
        let xPosition = Math.min(firstMarkerBody.x, secondMarkerBody.x) + firstMarkerBody.width / 2;
        let yPosition = Math.min(firstMarkerBody.y, secondMarkerBody.y) + firstMarkerBody.width / 2;

        // This is where it gets spicy, finding the width and height
        let width = Math.max(firstMarkerBody.x, secondMarkerBody.x) - xPosition + firstMarkerBody.width / 2;
        let height = Math.max(firstMarkerBody.y, secondMarkerBody.y) - yPosition + firstMarkerBody.width / 2;

        // Lets put this all together and make the rectangleOfDeath
        return new Entity([
            new Component.Body(xPosition, yPosition, width, height),
            new Component.AppearanceShape("roundedFilledRect", "red", "black", 2)
        ]);

    }
}

export class CharacterController2D {
    constructor() {

    }

    // noinspection JSMethodCanBeStatic
    run(game) {

        game.ComponentStore.getAllComponentsOfComponentType("CharacterController2D").forEach((CharacterController2D, entityID) => {

            if (game.ComponentStore.entityHasComponent("Velocity", entityID)) {
                let Velocity = game.ComponentStore.entityGetComponent("Velocity", entityID);

                if (CharacterController2D.keys["KeyW"]) {
                    if (Velocity.yMomentum > 0) {
                        Velocity.yMomentum = -CharacterController2D.acceleration;
                    } else {
                        Velocity.yMomentum -= CharacterController2D.acceleration;
                    }
                }
                if (CharacterController2D.keys["KeyS"]) {
                    if (Velocity.yMomentum < 0) {
                        Velocity.yMomentum = CharacterController2D.acceleration;
                    } else {
                        Velocity.yMomentum += CharacterController2D.acceleration;
                    }

                }
                if (CharacterController2D.keys["KeyA"]) {
                    if (Velocity.xMomentum > 0) {
                        Velocity.xMomentum = -CharacterController2D.acceleration;
                    } else {
                        Velocity.xMomentum -= CharacterController2D.acceleration;
                    }
                }
                if (CharacterController2D.keys["KeyD"]) {
                    if (Velocity.xMomentum < 0) {
                        Velocity.xMomentum = CharacterController2D.acceleration;
                    } else {
                        Velocity.xMomentum += CharacterController2D.acceleration;
                    }
                }

            } else if (game.ComponentStore.entityHasComponent("Body", entityID)) {
                let Body = game.ComponentStore.entityGetComponent("Body", entityID);

                if (CharacterController2D.keys["KeyW"]) {
                    Body.y -= CharacterController2D.acceleration;
                }
                if (CharacterController2D.keys["KeyS"]) {
                    Body.y += CharacterController2D.acceleration;
                }
                if (CharacterController2D.keys["KeyA"]) {
                    Body.x -= CharacterController2D.acceleration;
                }
                if (CharacterController2D.keys["KeyD"]) {
                    Body.x += CharacterController2D.acceleration;
                }
            }
        })
    }
}

export class Velocity {
    constructor() {

    }

    // noinspection JSMethodCanBeStatic
    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("Velocity").forEach((Velocity, entityID) => {
            if (game.ComponentStore.entityHasComponent("Body", entityID)) {
                let Body = game.ComponentStore.entityGetComponent("Body", entityID);

                // If xMomentum is great than it limit set it to the limit
                Velocity.xMomentum = Velocity.xMomentum > Velocity.maxXMomentum ? Velocity.maxXMomentum : Velocity.xMomentum;
                Velocity.xMomentum = Velocity.xMomentum < -Velocity.maxXMomentum ? -Velocity.maxXMomentum : Velocity.xMomentum;
                // Equally with the yMomentum
                Velocity.yMomentum = Velocity.yMomentum > Velocity.maxYMomentum ? Velocity.maxYMomentum : Velocity.yMomentum;
                Velocity.yMomentum = Velocity.yMomentum < -Velocity.maxYMomentum ? -Velocity.maxYMomentum : Velocity.yMomentum;

                Body.x += Velocity.xMomentum;
                Body.y += Velocity.yMomentum;

                Velocity.xMomentum *= Velocity.baseFriction;
                Velocity.yMomentum *= Velocity.baseFriction;
            }
        })
    }
}

/*
The role of this system is to go through the keypress buffer (game.keys) and pass those inputs to components which use keypress
 */
export class ClientHandleInputs {
    constructor(componentsThatAcceptInputs) {
        this.componentsThatAcceptInputs = componentsThatAcceptInputs;
    }

    run(game) {

        for (let key of game.keys) {
            for (let componentToSearchFor of this.componentsThatAcceptInputs) {
                game.ComponentStore.getAllComponentsOfComponentType(componentToSearchFor).forEach((component) => {
                    if (component.keys.hasOwnProperty(key.code)) {
                        component.keys[key.code] = key.state;
                    }
                })
            }
        }

        game.keys = [];
    }
}

export class MarkerHandler {
    constructor(){
        this.MARKER_MAX_LIFE = (1000 * 10)
    }

    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("Marker").forEach((marker, markerID) => {
            // If its over 20 seconds old lets kill it
            if (Date.now() > marker.timestamp + this.MARKER_MAX_LIFE) {
                if (marker.rectangleOfDeath != null){
                    game.ComponentStore.deleteEntity(marker.rectangleOfDeath);
                }

                let owner = game.ComponentStore.entityGetComponent("MarkerSummoner", marker.owner);

                if (owner.firstMarkerID === markerID){
                    owner.firstMarkerID = null;
                } else if (owner.secondMarkerID === markerID){
                    owner.secondMarkerID = null;
                }

                game.ComponentStore.deleteEntity(markerID);

            }
        })
    }
}