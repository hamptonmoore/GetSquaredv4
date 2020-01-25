import {Entity} from './classes/Entity.js'
import * as Component from './classes/Component.js'
import * as Systems from './classes/Systems.js'
import {ComponentStore} from "./classes/ComponentStore.js";

let canvas = document.getElementById("game");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

/*
    Lets create the base game state
*/
let game = {
    screen: {
        width: canvas.width,
        height: canvas.height
    },
    size: {
        width: 2048,
        height: 2048
    },
    scale: Math.min(document.body.clientWidth, document.body.clientHeight)/512, // Everything is scaled based on the game normally being 512px by 512px. Why those dimensions? Because I said so
    systems: new Map(),
    ComponentStore: new ComponentStore(),
    keys: [] // Keypresses since the last time system HandleInputs was run
};
/*
Register the Systems
 */
game.systems.set("PlayerRespawnHandler", new Systems.PlayerRespawnHandler());
game.systems.set("ClientHandleInputs", new Systems.ClientHandleInputs(["CharacterController2D", "MarkerSummoner"]));
game.systems.set("BotControlHandler", new Systems.BotControlHandler());
game.systems.set("CharacterController2D", new Systems.CharacterController2D());
game.systems.set("Velocity", new Systems.Velocity());
game.systems.set("BorderControl", new Systems.BorderControl());
game.systems.set("MarkerHandler", new Systems.MarkerHandler());
game.systems.set("MarkerSummoner", new Systems.MarkerSummoner());
game.systems.set("RectangleOfDeathHandler", new Systems.RectangleOfDeathHandler());
game.systems.set("Render", new Systems.Render(canvas));
game.systems.set("RenderScoreboard", new Systems.RenderScoreboard(canvas));
/*
    Lets create an Entity
*/

// Player
game.ComponentStore.addEntity(new Entity([
    new Component.Body(50, 50, 20, 20),
    new Component.AppearanceShape("roundedFilledRect", "random", "black", 2),
    new Component.CharacterController2D(1),
    new Component.Velocity(0, 0, 3, 3, 0.8),
    new Component.MarkerSummoner(),
    new Component.Player(),
    new Component.LocalPlayer(),
    new Component.PlayerRespawn()
]));


// Bot

for (let i = 0; i < 30; i++) {
    game.ComponentStore.addEntity(new Entity([
        new Component.Body(0, 0, 20, 20),
        new Component.AppearanceShape("roundedFilledRect", "random", "black", 2),
        new Component.Velocity(0, 0, 3, 3, 0.8),
        new Component.CharacterController2D(1),
        new Component.MarkerSummoner(),
        new Component.Player(),
        new Component.PlayerRespawn(),
        new Component.BotControl()
    ]));
}

setInterval(function() {
    for (let system of game.systems.values()){
        system.run(game);
    }
}, 1000/60);

document.addEventListener("keydown", function(event){
    game.keys.push({code: event.code, state: true});
});

document.addEventListener("keyup", function(event){
    game.keys.push({code: event.code, state: false});
});
