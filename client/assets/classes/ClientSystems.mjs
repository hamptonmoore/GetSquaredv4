export * from './SharedSystems.mjs';
export * from './ServerSystems.mjs';

export class Render {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas2DContext = canvas.getContext('2d');
    }

    run(game) {
        this.canvas2DContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get the location of the player
        let clientID = game.ComponentStore.getComponentsByComponentType("LocalPlayer").keys().next().value;
        let clientBody = game.ComponentStore.getComponentByEntityId("Body", clientID) || {x: game.size.width/2, y: game.size.height/2};

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

            this.canvas2DContext.lineTo(i  - ((clientBody.x % 60) * game.scale),game.screen.height + extraSpace);

            this.canvas2DContext.stroke();

            this.canvas2DContext.closePath();
        }

        for (let i = 0; i < game.screen.height + extraSpace; i += gridSpace){
            this.canvas2DContext.beginPath();

            this.canvas2DContext.moveTo(0,i  - ((clientBody.y % 60) * game.scale));

            this.canvas2DContext.lineTo(game.screen.width + extraSpace,i  - ((clientBody.y % 60) * game.scale));

            this.canvas2DContext.stroke();

            this.canvas2DContext.closePath();
        }

        // Move the player to the center
        this.canvas2DContext.translate(xOffset, yOffset);
        this.canvas2DContext.strokeStyle = "black";
        this.canvas2DContext.lineWidth = 10 * game.scale;
        this.canvas2DContext.strokeRect(0 , 0, game.size.width * game.scale, game.size.height * game.scale);

        game.ComponentStore.getComponentsByComponentType("Body").forEach((Body, entityID) => {
            if (game.ComponentStore.checkComponentByEntityId("AppearanceShape", entityID)) {
                let AppearanceShape = game.ComponentStore.getComponentByEntityId("AppearanceShape", entityID);

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

            if (game.ComponentStore.checkComponentByEntityId("Player", entityID)) {
                let Player = game.ComponentStore.getComponentByEntityId("Player", entityID);

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

        game.ComponentStore.getComponentsByComponentType("Player").forEach((Player, PlayerID) => {
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

        game.ComponentStore.getComponentsByComponentType("LocalPlayer").forEach((localPlayer, localPlayerID) => {
            localPlayers.push(localPlayerID);

        });

        this.canvas2DContext.fillText(`-- Scoreboard --`, 25 * game.scale, 20* game.scale);

        for (let i = 0; i < players.length; i++){
            this.canvas2DContext.fillText(`${players[i].name}: ${players[i].points}`, 25 * game.scale, (40 + (i * 15))* game.scale);
        }

    }
}