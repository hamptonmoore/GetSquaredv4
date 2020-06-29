import {Entity} from './Entity.mjs'
import * as Components from "./Components.mjs";

export class Player extends Entity {
    constructor(username, color){
        super([
            new Components.Body(0, 0, 20, 20),
            new Components.AppearanceShape("roundedFilledRect", color, "black", 2),
            new Components.CharacterController2D(1),
            new Components.Velocity(0, 0, 3, 3, 0.8),
            new Components.MarkerSummoner(),
            new Components.Player(username),
            new Components.LocalPlayer(),
            new Components.PlayerRespawn()
        ], "Player", arguments)
    }
}

export class Bot extends Entity {
    constructor(username, color){
        super([
                new Components.Body(0, 0, 20, 20),
                new Components.AppearanceShape("roundedFilledRect", color, "black", 2),
                new Components.Velocity(0, 0, 3, 3, 0.8),
                new Components.CharacterController2D(1),
                new Components.MarkerSummoner(),
                new Components.Player(username),
                new Components.PlayerRespawn(),
                new Components.BotControl()
        ], "Bot", arguments)
    }
}

export class Marker extends Entity {
    constructor(x, y, fill, stroke, ownerID){
        super([
            new Components.Body(x + 2.5, y + 2.5, 10, 10),
            new Components.AppearanceShape("roundedFilledRect", fill, stroke, 2),
            new Components.Marker(ownerID, Date.now())
        ], "Marker", arguments)
    }
}

export class RectangleOfDeath extends Entity {
    constructor(x, y, width, height, fill, ownerID){
        super([
            new Components.Body(x, y, width, height),
            new Components.AppearanceShape("roundedFilledRect", fill, "black", 2),
            new Components.RectangleOfDeath(ownerID)
        ], "RectangleOfDeath", arguments)
    }
}