import * as Assemblages from './classes/Assemblages.js'
import * as Systems from './classes/Systems.js'
import {ComponentStore} from "./classes/ComponentStore.js";
import * as randomGenerators from './classes/randomGenerators.js'

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
document.getElementById("username").setAttribute("placeholder", localStorage.getItem('username') || randomGenerators.generateName());
document.getElementById("color").setAttribute("value", localStorage.getItem('color') || randomGenerators.generateColor());


// Bot

for (let i = 0; i < 30; i++) {
    game.ComponentStore.addEntity(new Assemblages.Bot(randomGenerators.generateName(), randomGenerators.generateColor()));
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

document.getElementById("startGame").addEventListener("click", function(){
    let username = document.getElementById("username").value || document.getElementById("username").getAttribute("placeholder");
    let color = document.getElementById("color").value;
    game.ComponentStore.addEntity(new Assemblages.Player(username, color));
    localStorage.setItem('username', username);
    localStorage.setItem('color', color);
    document.getElementById("main-menu").style.visibility = 'hidden';
});