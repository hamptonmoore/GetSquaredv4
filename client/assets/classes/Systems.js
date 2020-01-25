import {Entity} from "./Entity.js";
import * as Component from "./Component.js";

export class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game) {
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get the location of the player
        let clientID = game.ComponentStore.getAllComponentsOfComponentType("LocalPlayer").keys().next().value;
        let clientBody = game.ComponentStore.getComponentFromEntity("Body", clientID);

        // Do math to move the player to the center of the screen
        let xOffset = -((clientBody.x * game.scale) - ((game.screen.width/2)));
        let yOffset = -((clientBody.y * game.scale) - ((game.screen.height/2)));

        // Before that lets draw the grid
        this.canvas2DContext.strokeStyle = "gray";
        this.canvas2DContext.lineWidth = 1 * game.scale;

        let extraSpace = (60 * game.scale);
        let gridSpace = 60 * game.scale;

        for (let i = 0; i < game.screen.width + extraSpace; i += gridSpace){
            this.canvas2DContext.beginPath();

            this.canvas2DContext.moveTo(i  - ((clientBody.x % 60) * game.scale),0);

            this.canvas2DContext.lineTo(i  - ((clientBody.x % 60) * game.scale),game.screen.height * game.scale);

            this.canvas2DContext.stroke();

            this.canvas2DContext.closePath();
        }

        for (let i = 0; i < game.screen.height + (60 * game.scale); i += gridSpace){
            this.canvas2DContext.beginPath();

            this.canvas2DContext.moveTo(0,i  - ((clientBody.y % 60) * game.scale));

            this.canvas2DContext.lineTo(game.screen.height * game.scale + extraSpace,i  - ((clientBody.y % 60) * game.scale));

            this.canvas2DContext.stroke();

            this.canvas2DContext.closePath();
        }

        // Move the player to the center
        this.canvas2DContext.translate(xOffset, yOffset);
        this.canvas2DContext.strokeStyle = "black";
        this.canvas2DContext.lineWidth = 10 * game.scale;
        this.canvas2DContext.strokeRect(0 , 0, game.size.width * game.scale, game.size.height * game.scale);

        game.ComponentStore.getAllComponentsOfComponentType("Body").forEach((Body, entityID) => {
            if (game.ComponentStore.doesEntityHaveComponent("AppearanceShape", entityID)) {
                let AppearanceShape = game.ComponentStore.getComponentFromEntity("AppearanceShape", entityID);

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

            if (game.ComponentStore.doesEntityHaveComponent("Player", entityID)) {
                let Player = game.ComponentStore.getComponentFromEntity("Player", entityID);

                this.canvas2DContext.font = `${8 * game.scale}px Lucida Console, Monaco, monospace`;
                this.canvas2DContext.fillStyle = "black";
                this.canvas2DContext.fillText(`${Player.playerName}`, (Body.x - (Player.playerName.length/2 * 2.5)) * game.scale, (Body.y - 5) * game.scale);

            }
        });

        // Move the the canvas back
        this.canvas2DContext.translate(-xOffset, -yOffset);
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

export class RenderScoreboard {
    constructor(canvas) {
        // noinspection JSUnusedGlobalSymbols
        this.canvas = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game) {
        // Lets only update a forth of the time

        this.canvas2DContext.font = `${8 * game.scale * 2}px Lucida Console, Monaco, monospace`;
        this.canvas2DContext.fillStyle = "black";

        let players = [];

        game.ComponentStore.getAllComponentsOfComponentType("Player").forEach((Player, PlayerID) => {
            players.push({id: PlayerID, points: Player.points, name: Player.playerName});
        });

        players.sort(function(a, b) {
            return b.points - a.points;
        });

        players = players.slice(0, 5);

        players.forEach((player) => {
            player.name = player.name.substring(0, 13).padEnd(13);
        });

        let localPlayers = [];

        game.ComponentStore.getAllComponentsOfComponentType("LocalPlayer").forEach((localPlayer, localPlayerID) => {
            localPlayers.push(localPlayerID);

        });

        this.canvas2DContext.fillText(`-- Scoreboard --`, 25 * game.scale, 20* game.scale);

        for (let i = 0; i < players.length; i++){
            if (localPlayers.includes(players[i].id)){
                this.canvas2DContext.fillStyle = "red";
            } else {
                this.canvas2DContext.fillStyle = "black";
            }
            this.canvas2DContext.fillText(`${players[i].name}: ${players[i].points}`, 25 * game.scale, (40 + (i * 15))* game.scale);
        }

    }
}

export class MarkerSummoner {
    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("MarkerSummoner").forEach((MarkerSummoner, entityID) => {
            // If it doesnt have a body or space is not being held then return
            if (!game.ComponentStore.doesEntityHaveComponent("Body", entityID) || !game.ComponentStore.doesEntityHaveComponent("AppearanceShape", entityID) || !MarkerSummoner.keys["Space"]) {
                return;
            }



            let Body = game.ComponentStore.getComponentFromEntity("Body", entityID);
            let AppearanceShape = game.ComponentStore.getComponentFromEntity("AppearanceShape", entityID);

            let Marker = new Entity([
                new Component.Body(Body.x + 2.5, Body.y + 2.5, 10, 10),
                new Component.AppearanceShape("roundedFilledRect", AppearanceShape.fill, AppearanceShape.stroke, 2),
                new Component.Marker(entityID, Date.now())
            ]);

            game.ComponentStore.addEntity(Marker);

            if (MarkerSummoner.firstMarkerID == null) {
                MarkerSummoner.firstMarkerID = Marker.id;
            } else if (MarkerSummoner.secondMarkerID == null) {
                MarkerSummoner.secondMarkerID = Marker.id;
            } else {
                game.ComponentStore.deleteEntity(game.ComponentStore.getComponentFromEntity("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath);
                game.ComponentStore.deleteEntity(MarkerSummoner.firstMarkerID);
                MarkerSummoner.firstMarkerID = MarkerSummoner.secondMarkerID;
                MarkerSummoner.secondMarkerID = Marker.id;
            }
            if (MarkerSummoner.firstMarkerID != null && MarkerSummoner.secondMarkerID != null) {
                let rectangleOfDeath = this.createRectangleOfDeath(
                    game.ComponentStore.getComponentFromEntity("Body", MarkerSummoner.firstMarkerID),
                    game.ComponentStore.getComponentFromEntity("Body", MarkerSummoner.secondMarkerID),
                    entityID,
                    AppearanceShape
                );

                game.ComponentStore.getComponentFromEntity("Marker", MarkerSummoner.firstMarkerID).rectangleOfDeath = rectangleOfDeath.id;
                game.ComponentStore.getComponentFromEntity("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath = rectangleOfDeath.id;

                game.ComponentStore.addEntity(rectangleOfDeath);
            }
            MarkerSummoner.keys["Space"] = false;
        })
    }

    // noinspection JSMethodCanBeStatic
    createRectangleOfDeath(firstMarkerBody, secondMarkerBody, owner, AppearanceShape) {

        // lets get the lowest x and y coordinate out of the two
        let xPosition = Math.min(firstMarkerBody.x, secondMarkerBody.x) + firstMarkerBody.width / 2;
        let yPosition = Math.min(firstMarkerBody.y, secondMarkerBody.y) + firstMarkerBody.width / 2;

        // This is where it gets spicy, finding the width and height
        let width = Math.max(firstMarkerBody.x, secondMarkerBody.x) - xPosition + firstMarkerBody.width / 2;
        let height = Math.max(firstMarkerBody.y, secondMarkerBody.y) - yPosition + firstMarkerBody.width / 2;

        // Lets put this all together and make the rectangleOfDeath
        return new Entity([
            new Component.Body(xPosition, yPosition, width, height),
            new Component.AppearanceShape("roundedFilledRect", AppearanceShape.fill, "black", 2),
            new Component.RectangleOfDeath(owner)
        ]);

    }
}

export class CharacterController2D {
    // noinspection JSMethodCanBeStatic
    run(game) {

        game.ComponentStore.getAllComponentsOfComponentType("CharacterController2D").forEach((CharacterController2D, entityID) => {

            if (game.ComponentStore.doesEntityHaveComponent("Velocity", entityID)) {
                let Velocity = game.ComponentStore.getComponentFromEntity("Velocity", entityID);

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

            } else if (game.ComponentStore.doesEntityHaveComponent("Body", entityID)) {
                let Body = game.ComponentStore.getComponentFromEntity("Body", entityID);

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
    // noinspection JSMethodCanBeStatic
    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("Velocity").forEach((Velocity, entityID) => {
            if (game.ComponentStore.doesEntityHaveComponent("Body", entityID)) {
                let Body = game.ComponentStore.getComponentFromEntity("Body", entityID);

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
        game.ComponentStore.getAllComponentsOfComponentType("LocalPlayer").forEach((localPlayer, localPlayerID) => {
            for (let key of game.keys) {
                for (let componentToSearchFor of this.componentsThatAcceptInputs) {
                    game.ComponentStore.getAllComponentsOfComponentType(componentToSearchFor).forEach((component, componentID) => {
                        if (component.keys.hasOwnProperty(key.code) && componentID === localPlayerID) {
                            component.keys[key.code] = key.state;
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
        game.ComponentStore.getAllComponentsOfComponentType("Marker").forEach((marker, markerID) => {
            // If its over 20 seconds old lets kill it
            if (Date.now() > marker.timestamp + this.MARKER_MAX_LIFE) {
                if (marker.rectangleOfDeath != null) {
                    game.ComponentStore.deleteEntity(marker.rectangleOfDeath);
                }

                let owner = game.ComponentStore.getComponentFromEntity("MarkerSummoner", marker.owner);

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

export class PlayerRespawnHandler {

    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("PlayerRespawn").forEach((playerRespawn, playerRespawnID) => {

            let Body = game.ComponentStore.getComponentFromEntity("Body", playerRespawnID);
            let Player = game.ComponentStore.getComponentFromEntity("Player", playerRespawnID);
            let MarkerSummoner = game.ComponentStore.getComponentFromEntity("MarkerSummoner", playerRespawnID);

            Body.x = this.randomInt(0, game.size.width-Body.width);
            Body.y = this.randomInt(0, game.size.height-Body.height);
            Player.points = 0;

            if (MarkerSummoner.firstMarkerID !== null) {
                game.ComponentStore.deleteEntity(MarkerSummoner.firstMarkerID);
            }

            if (MarkerSummoner.secondMarkerID !== null) {
                if (game.ComponentStore.getComponentFromEntity("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath !== null) {
                    game.ComponentStore.deleteEntity(game.ComponentStore.getComponentFromEntity("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath);
                }

                game.ComponentStore.deleteEntity(MarkerSummoner.secondMarkerID);
            }

            MarkerSummoner.firstMarkerID = null;
            MarkerSummoner.secondMarkerID = null;

            game.ComponentStore.deleteComponentsFromEntity("PlayerRespawn", playerRespawnID);
        })
    }

    // noinspection JSMethodCanBeStatic
    randomInt(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export class RectangleOfDeathHandler {
    run(game) {
        game.ComponentStore.getAllComponentsOfComponentType("RectangleOfDeath").forEach((rectangleOfDeath, rectangleOfDeathID) => {
            let rectangleOfDeathBody = game.ComponentStore.getComponentFromEntity("Body", rectangleOfDeathID);
            game.ComponentStore.getAllComponentsOfComponentType("Player").forEach((player, playerID) => {
                if (playerID === rectangleOfDeath.owner) {
                    return;
                }

                let playerBody = game.ComponentStore.getComponentFromEntity("Body", playerID);

                if (playerBody.x < rectangleOfDeathBody.x + rectangleOfDeathBody.width &&
                    playerBody.x + playerBody.width > rectangleOfDeathBody.x &&
                    playerBody.y < rectangleOfDeathBody.y + rectangleOfDeathBody.height &&
                    playerBody.y + playerBody.height > rectangleOfDeathBody.y) {

                    game.ComponentStore.setComponentsFromEntity("PlayerRespawn", playerID, new Component.PlayerRespawn());

                    if (game.ComponentStore.doesEntityHaveComponent("Player", rectangleOfDeath.owner)){
                        game.ComponentStore.getComponentFromEntity("Player", rectangleOfDeath.owner).points += 1;
                    }
                }
            })
        })
    }
}

export class BorderControl {
    run(game){
        this.constrainBorder(game);
    }

    // noinspection JSUnusedGlobalSymbols
    constrainBorder(game){
        game.ComponentStore.getAllComponentsOfComponentType("Body").forEach((Body) => {
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
        game.ComponentStore.getAllComponentsOfComponentType("Body").forEach((Body) => {
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

export class BotControlHandler {
    run(game){
        game.ComponentStore.getAllComponentsOfComponentType("BotControl").forEach((BotControl, BotID) => {
            if (!game.ComponentStore.doesEntityHaveComponent("CharacterController2D", BotID) || !game.ComponentStore.doesEntityHaveComponent("Body", BotID) || !game.ComponentStore.doesEntityHaveComponent("MarkerSummoner", BotID)){
                return;
            }

            // Lets only update every 10ish frames
            if (Math.random() > 0.10){
                return;
            }

            let CharacterController2D = game.ComponentStore.getComponentFromEntity("CharacterController2D", BotID);
            let Body = game.ComponentStore.getComponentFromEntity("Body", BotID);
            let MarkerSummoner = game.ComponentStore.getComponentFromEntity("MarkerSummoner", BotID);

            if (BotControl.target === null){
                // Find someone to track
                let closest = {
                    id: "",
                    distance: null,
                };

                game.ComponentStore.getAllComponentsOfComponentType("Player").forEach((Player, PlayerID) => {

                    if (PlayerID === BotID){
                        return;
                    }

                    if (!game.ComponentStore.doesEntityHaveComponent("Body", PlayerID)){
                        return;
                    }

                    let PlayerBody = game.ComponentStore.getComponentFromEntity("Body", PlayerID);

                    let distanceBetweenPlayerAndBot = this.distanceBetweenPoints(Body.x, Body.y, PlayerBody.x, PlayerBody.y);

                    if (distanceBetweenPlayerAndBot < closest.distance || closest.distance === null){
                        closest.distance = distanceBetweenPlayerAndBot;
                        closest.id = PlayerID;
                    }
                });

                BotControl.target = closest.id;

            } else {
                if (!game.ComponentStore.doesEntityHaveComponent("Body", BotControl.target)){
                    BotControl.target = null;
                    return;
                }

                let TargetBody = game.ComponentStore.getComponentFromEntity("Body", BotControl.target);

                CharacterController2D.keys["KeyW"] = TargetBody.y < Body.y;
                CharacterController2D.keys["KeyS"] = TargetBody.y > Body.y;

                CharacterController2D.keys["KeyA"] = TargetBody.x < Body.x;
                CharacterController2D.keys["KeyD"] = TargetBody.x > Body.x;

                if (Math.random() < 0.20){
                    MarkerSummoner.keys["Space"] = true;
                }

            }
        })
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    calculateAngleBetweenPoints(px, py, ax, ay)
    {
        return Math.atan((ax-px)/(ay-py));
    }

    // noinspection JSMethodCanBeStatic
    distanceBetweenPoints(x1,y1,x2,y2){
        if(!x2) x2=0;
        if(!y2) y2=0;
        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    }
}
