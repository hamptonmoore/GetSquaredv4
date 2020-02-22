import * as Assemblages from './classes/Assemblages.js'
import * as Systems from './classes/Systems.js'
import {ComponentStore} from "./classes/ComponentStore.js";
import * as randomGenerators from './classes/randomGenerators.js'
import {ComponentStoreChangeTracker} from "./classes/ComponentStoreChangeTracker.js";

let canvas = document.getElementById("game");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

/*
    Lets create the base game state
*/
let changeTracker = new ComponentStoreChangeTracker();

let game = {
    screen: {
        width: canvas.width,
        height: canvas.height
    },
    size: {
        width: 2048,
        height: 2048
    },
    debug: {
        changeCount: 1,
        roundsOfChange: 1,
    },
    tick: 0,
    scale: Math.min(document.body.clientWidth, document.body.clientHeight)/512, // Everything is scaled based on the game normally being 512px by 512px. Why those dimensions? Because I said so
    systems: [],
    ComponentStoreChangeTracker: changeTracker,
    ComponentStore: new ComponentStore(changeTracker),
    keys: [] // Keypresses since the last time system HandleInputs was run
};
/*
Register the Systems
 */
game.systems.push(new Systems.PlayerRespawnHandler());
game.systems.push(new Systems.ClientHandleInputs(["CharacterController2D", "MarkerSummoner"]));
game.systems.push(new Systems.BotControlHandler());
game.systems.push(new Systems.CharacterController2D());
game.systems.push(new Systems.Velocity());
game.systems.push(new Systems.BorderControl());
game.systems.push(new Systems.MarkerHandler());
game.systems.push(new Systems.MarkerSummoner());
game.systems.push(new Systems.RectangleOfDeathHandler());
game.systems.push(new Systems.Render(canvas));
game.systems.push(new Systems.RenderScoreboard(canvas));
game.systems.push(new Systems.ComponentStoreChangeTrackerManager());
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
    game.tick++;
    for (let system of game.systems){
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

document.getElementById("startGame").focus();
