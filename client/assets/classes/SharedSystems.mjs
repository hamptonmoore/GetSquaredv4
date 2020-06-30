import * as Assemblages from './Assemblages.mjs'
import * as Components from "./Components.mjs";

export class MarkerSummoner {
    run(game) {

        game.ComponentStore.getComponentsByComponentType("MarkerSummoner").forEach((MarkerSummoner, entityID) => {
            // If it doesnt have a body or space is not being held then return
            if (!game.ComponentStore.checkComponentByEntityId("Body", entityID) || !game.ComponentStore.checkComponentByEntityId("AppearanceShape", entityID) || !MarkerSummoner["Space"]) {
                return;
            }



            let Body = game.ComponentStore.getComponentByEntityId("Body", entityID);
            let AppearanceShape = game.ComponentStore.getComponentByEntityId("AppearanceShape", entityID);

            let Marker = new Assemblages.Marker(Body.x, Body.y, AppearanceShape.fill, AppearanceShape.stroke, entityID);

            game.ComponentStore.addEntity(Marker);

            if (MarkerSummoner.firstMarkerID == null) {
                MarkerSummoner.firstMarkerID = Marker.id;
            } else if (MarkerSummoner.secondMarkerID == null) {
                MarkerSummoner.secondMarkerID = Marker.id;
            } else {
                game.ComponentStore.deleteEntity(game.ComponentStore.getComponentByEntityId("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath);
                game.ComponentStore.deleteEntity(MarkerSummoner.firstMarkerID);
                MarkerSummoner.firstMarkerID = MarkerSummoner.secondMarkerID;
                MarkerSummoner.secondMarkerID = Marker.id;
            }
            if (MarkerSummoner.firstMarkerID != null && MarkerSummoner.secondMarkerID != null) {
                let rectangleOfDeath = this.createRectangleOfDeath(
                    game.ComponentStore.getComponentByEntityId("Body", MarkerSummoner.firstMarkerID),
                    game.ComponentStore.getComponentByEntityId("Body", MarkerSummoner.secondMarkerID),
                    entityID,
                    AppearanceShape
                );

                game.ComponentStore.getComponentByEntityId("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath = rectangleOfDeath.id;
                game.ComponentStore.getComponentByEntityId("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath = rectangleOfDeath.id;

                game.ComponentStore.addEntity(rectangleOfDeath);
            }
            MarkerSummoner["Space"] = false;
        })
    }

    // noinspection JSMethodCanBeStatic
    createRectangleOfDeath(firstMarkerBody, secondMarkerBody, owner, AppearanceShape) {

        // lets get the lowest x and y coordinate out of the two
        let x = Math.min(firstMarkerBody.x, secondMarkerBody.x) + firstMarkerBody.width / 2;
        let y = Math.min(firstMarkerBody.y, secondMarkerBody.y) + firstMarkerBody.width / 2;

        // This is where it gets spicy, finding the width and height
        let width = Math.max(firstMarkerBody.x, secondMarkerBody.x) - x + firstMarkerBody.width / 2;
        let height = Math.max(firstMarkerBody.y, secondMarkerBody.y) - y + firstMarkerBody.width / 2;

        // Lets put this all together and make the rectangleOfDeath
        return new Assemblages.RectangleOfDeath(x, y, width, height, AppearanceShape.fill, owner)
    }
}

export class CharacterController2D {
    // noinspection JSMethodCanBeStatic
    run(game) {

        game.ComponentStore.getComponentsByComponentType("CharacterController2D").forEach((CharacterController2D, entityID) => {

            if (game.ComponentStore.checkComponentByEntityId("Velocity", entityID)) {
                let Velocity = game.ComponentStore.getComponentByEntityId("Velocity", entityID);

                if (CharacterController2D["KeyW"]) {
                    if (Velocity.yMomentum > 0) {
                        Velocity.yMomentum = -CharacterController2D.acceleration;
                    } else {
                        Velocity.yMomentum -= CharacterController2D.acceleration;
                    }
                }
                if (CharacterController2D["KeyS"]) {
                    if (Velocity.yMomentum < 0) {
                        Velocity.yMomentum = CharacterController2D.acceleration;
                    } else {
                        Velocity.yMomentum += CharacterController2D.acceleration;
                    }

                }
                if (CharacterController2D["KeyA"]) {
                    if (Velocity.xMomentum > 0) {
                        Velocity.xMomentum = -CharacterController2D.acceleration;
                    } else {
                        Velocity.xMomentum -= CharacterController2D.acceleration;
                    }
                }
                if (CharacterController2D["KeyD"]) {
                    if (Velocity.xMomentum < 0) {
                        Velocity.xMomentum = CharacterController2D.acceleration;
                    } else {
                        Velocity.xMomentum += CharacterController2D.acceleration;
                    }
                }

            } else if (game.ComponentStore.checkComponentByEntityId("Body", entityID)) {
                let Body = game.ComponentStore.getComponentByEntityId("Body", entityID);

                if (CharacterController2D["KeyW"]) {
                    Body.y -= CharacterController2D.acceleration;
                }
                if (CharacterController2D["KeyS"]) {
                    Body.y += CharacterController2D.acceleration;
                }
                if (CharacterController2D["KeyA"]) {
                    Body.x -= CharacterController2D.acceleration;
                }
                if (CharacterController2D["KeyD"]) {
                    Body.x += CharacterController2D.acceleration;
                }
            }
        })
    }
}

export class Velocity {
    // noinspection JSMethodCanBeStatic
    run(game) {

        game.ComponentStore.getComponentsByComponentType("Velocity").forEach((Velocity, entityID) => {
            if (game.ComponentStore.checkComponentByEntityId("Body", entityID)) {
                let Body = game.ComponentStore.getComponentByEntityId("Body", entityID);

                // If xMomentum is great than it limit set it to the limit
                let xMomentum = Velocity.xMomentum > Velocity.maxXMomentum ? Velocity.maxXMomentum : Velocity.xMomentum;
                xMomentum = xMomentum < -Velocity.maxXMomentum ? -Velocity.maxXMomentum : xMomentum;

                // Equally with the yMomentum
                let yMomentum = Velocity.yMomentum > Velocity.maxYMomentum ? Velocity.maxYMomentum : Velocity.yMomentum;
                yMomentum = yMomentum < -Velocity.maxYMomentum ? -Velocity.maxYMomentum : yMomentum;

                Body.x = Math.round(Body.x + xMomentum);
                Body.y = Math.round(Body.y + yMomentum);

                Velocity.xMomentum = xMomentum * Velocity.baseFriction;
                Velocity.yMomentum = yMomentum * Velocity.baseFriction;
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
        game.ComponentStore.getComponentsByComponentType("LocalPlayer").forEach((localPlayer, localPlayerID) => {
            for (let key of game.keys) {
                for (let componentToSearchFor of this.componentsThatAcceptInputs) {
                    game.ComponentStore.getComponentsByComponentType(componentToSearchFor).forEach((component, componentID) => {
                        if (component.hasOwnProperty(key.code) && componentID === localPlayerID) {
                            component[key.code] = key.state;
                        }
                    })
                }
            }
        });

        game.keys = [];
    }
}

export class MarkerHandler {
    constructor() {
        this.MARKER_MAX_LIFE = (1000 * 10)
    }

    run(game) {
        game.ComponentStore.getComponentsByComponentType("Marker").forEach((marker, markerID) => {
            // If its over 20 seconds old lets kill it
            if (Date.now() > marker.timestamp + this.MARKER_MAX_LIFE) {
                if (marker.rectangleOfDeath != null) {
                    game.ComponentStore.deleteEntity(marker.rectangleOfDeath);
                }

                let owner = game.ComponentStore.getComponentByEntityId("MarkerSummoner", marker.owner);

                if (owner.firstMarkerID === markerID) {
                    owner.firstMarkerID = null;
                } else if (owner.secondMarkerID === markerID) {
                    owner.secondMarkerID = null;
                }

                game.ComponentStore.deleteEntity(markerID);

            }
        })
    }
}

export class RectangleOfDeathHandler {
    run(game) {
        game.ComponentStore.getComponentsByComponentType("RectangleOfDeath").forEach((rectangleOfDeath, rectangleOfDeathID) => {
            let rectangleOfDeathBody = game.ComponentStore.getComponentByEntityId("Body", rectangleOfDeathID);
            game.ComponentStore.getComponentsByComponentType("Player").forEach((player, playerID) => {
                if (playerID === rectangleOfDeath.owner) {
                    return;
                }

                let playerBody = game.ComponentStore.getComponentByEntityId("Body", playerID);

                if (playerBody.x < rectangleOfDeathBody.x + rectangleOfDeathBody.width &&
                    playerBody.x + playerBody.width > rectangleOfDeathBody.x &&
                    playerBody.y < rectangleOfDeathBody.y + rectangleOfDeathBody.height &&
                    playerBody.y + playerBody.height > rectangleOfDeathBody.y) {

                    game.ComponentStore.setComponentByEntityId("PlayerRespawn", playerID, new Components.PlayerRespawn());

                    if (game.ComponentStore.checkComponentByEntityId("Player", rectangleOfDeath.owner)){
                        game.ComponentStore.getComponentByEntityId("Player", rectangleOfDeath.owner).points += 1;
                    }
                }
            })
        })
    }
}

export class ComponentStoreChangeTrackerManager {
    // noinspection JSMethodCanBeStatic
    run(game){
        // game.ComponentStoreChangeTracker.optimize();
        game.ComponentStoreChangeTracker.emptyState();
    }
}

export class BorderControl {
    run(game){
        this.constrainBorder(game);
    }

    // noinspection JSUnusedGlobalSymbols
    constrainBorder(game){
        game.ComponentStore.getComponentsByComponentType("Body").forEach((Body) => {
            if (Body.x + Body.width > game.size.width){
                Body.x = game.size.width - Body.width;
            } else if (Body.x < 0){
                Body.x = 0;
            }

            if (Body.y + Body.height > game.size.height){
                Body.y = game.size.height - Body.height;
            } else if (Body.y < 0){
                Body.y = 0;
            }
        })
    }

    // noinspection JSUnusedGlobalSymbols
    loopBorder(game){
        game.ComponentStore.getComponentsByComponentType("Body").forEach((Body) => {
            if (Body.x + Body.width > game.size.width){
                Body.x = 0;
            } else if (Body.x < 0){
                Body.x = game.size.width - Body.width;
            }

            if (Body.y + Body.height > game.size.height){
                Body.y = 0;
            } else if (Body.y < 0){
                Body.y = game.size.height - Body.height;
            }
        })
    }
}
