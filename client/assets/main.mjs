import {Entity} from './classes/Entity.js'
import * as Components from './classes/Components.js'
import * as Systems from './classes/Systems.js'

let canvas = document.getElementById("game");
canvas.width = Math.min(document.body.clientWidth, document.body.clientHeight);
canvas.height = Math.min(document.body.clientWidth, document.body.clientHeight);

console.log(canvas.width);

/*
    Lets create the base game state
*/
let game = {
    screen: {
        width: canvas.width,
        height: canvas.height
    },
    scale: canvas.width/512, // Everything is scaled based on the game normally being 512px by 512px. Why those dimensions? Because I said so
    entities: new Map(),
    systems: new Map(),
    keys: [] // Keypresses since the last time system HandleInputs was run
};
/*
Register the Systems
 */
game.systems.set("ClientHandleInputs", new Systems.ClientHandleInputs(["CharacterController2D"]));
game.systems.set("CharacterController2D", new Systems.CharacterController2D());
game.systems.set("Velocity", new Systems.Velocity());
game.systems.set("Render", new Systems.Render(canvas));

/*
    Lets create an Entity
*/
let player = new Entity([
    new Components.Body(50, 50, 20, 20),
    new Components.CharacterController2D(1),
    new Components.Velocity(0, 0, 3, 3, 0.8)
]);

game.entities.set(player.id, player);

setInterval(function() {
    for (let system of game.systems.values()){
        system.run(game);
    }

    //game.entities.get(test.id).components["Body"].x++;
}, 1000/60);

document.addEventListener("keydown", function(event){
    game.keys.push({code: event.code, state: true});
});

document.addEventListener("keyup", function(event){
    game.keys.push({code: event.code, state: false});
});