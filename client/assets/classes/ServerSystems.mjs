export class PlayerRespawnHandler {

    run(game) {
        game.ComponentStore.getComponentsByComponentType("PlayerRespawn").forEach((playerRespawn, playerRespawnID) => {

            let Body = game.ComponentStore.getComponentByEntityId("Body", playerRespawnID);
            let Player = game.ComponentStore.getComponentByEntityId("Player", playerRespawnID);
            let MarkerSummoner = game.ComponentStore.getComponentByEntityId("MarkerSummoner", playerRespawnID);

            Body.x = this.randomInt(0, game.size.width-Body.width);
            Body.y = this.randomInt(0, game.size.height-Body.height);
            Player.points = 0;

            if (MarkerSummoner.firstMarkerID !== null) {
                game.ComponentStore.deleteEntity(MarkerSummoner.firstMarkerID);
            }

            if (MarkerSummoner.secondMarkerID !== null) {
                if (game.ComponentStore.getComponentByEntityId("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath !== null) {
                    game.ComponentStore.deleteEntity(game.ComponentStore.getComponentByEntityId("Marker", MarkerSummoner.secondMarkerID).rectangleOfDeath);
                }

                game.ComponentStore.deleteEntity(MarkerSummoner.secondMarkerID);
            }

            MarkerSummoner.firstMarkerID = null;
            MarkerSummoner.secondMarkerID = null;

            game.ComponentStore.deleteComponentByEntityId("PlayerRespawn", playerRespawnID);
        })
    }

    // noinspection JSMethodCanBeStatic
    randomInt(min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export class BotControlHandler {
    run(game){
        game.ComponentStore.getComponentsByComponentType("BotControl").forEach((BotControl, BotID) => {
            if (!game.ComponentStore.checkComponentByEntityId("CharacterController2D", BotID) || !game.ComponentStore.checkComponentByEntityId("Body", BotID) || !game.ComponentStore.checkComponentByEntityId("MarkerSummoner", BotID)){
                return;
            }

            if (Math.random() > 0.20){
                return;
            }

            if (Math.random() < 0.05){
                BotControl.target = null;
            }

            let CharacterController2D = game.ComponentStore.getComponentByEntityId("CharacterController2D", BotID);
            let Body = game.ComponentStore.getComponentByEntityId("Body", BotID);
            let MarkerSummoner = game.ComponentStore.getComponentByEntityId("MarkerSummoner", BotID);

            if (BotControl.target === null){
                // Find someone to track
                let closest = {
                    id: "",
                    distance: null,
                };

                game.ComponentStore.getComponentsByComponentType("Player").forEach((Player, PlayerID) => {

                    if (PlayerID === BotID){
                        return;
                    }

                    if (!game.ComponentStore.checkComponentByEntityId("Body", PlayerID)){
                        return;
                    }

                    let PlayerBody = game.ComponentStore.getComponentByEntityId("Body", PlayerID);

                    let distanceBetweenPlayerAndBot = this.distanceBetweenPoints(Body.x, Body.y, PlayerBody.x, PlayerBody.y);

                    if (distanceBetweenPlayerAndBot < closest.distance || closest.distance === null){
                        closest.distance = distanceBetweenPlayerAndBot;
                        closest.id = PlayerID;
                    }
                });

                BotControl.target = closest.id;

            } else {

                // Lets move to track our target
                if (!game.ComponentStore.checkComponentByEntityId("Body", BotControl.target)){
                    BotControl.target = null;
                    return;
                }

                // Our last priority is to watch out for ROD

                let closest = {
                    id: "",
                    distance: null,
                };

                if (Math.random() < 0.10){
                    MarkerSummoner["Space"] = true;
                }

                game.ComponentStore.getComponentsByComponentType("RectangleOfDeath").forEach((RectangleOfDeath, RectangleOfDeathID) => {
                    if (!game.ComponentStore.checkComponentByEntityId("Body", RectangleOfDeathID)){
                        return;
                    }

                    let RODBody = game.ComponentStore.getComponentByEntityId("Body", RectangleOfDeathID);

                    let distanceToROD = this.findClosest(Body, RODBody);

                    if ((distanceToROD < closest.distance || closest.distance === null) && (RectangleOfDeath.owner !== BotID)){
                        closest.distance = distanceToROD;
                        closest.id = RectangleOfDeathID;
                    }
                });

                if (closest.distance < 40 && closest.id !== ""){
                    let RODBody = game.ComponentStore.getComponentByEntityId("Body", closest.id);

                    CharacterController2D["KeyW"] = RODBody.y > Body.y;
                    CharacterController2D["KeyS"] = RODBody.y < Body.y;

                    CharacterController2D["KeyA"] = RODBody.x > Body.x;
                    CharacterController2D["KeyD"] = RODBody.x < Body.x;

                    BotControl.target = null;
                } else {
                    let TargetBody = game.ComponentStore.getComponentByEntityId("Body", BotControl.target);

                    CharacterController2D["KeyW"] = TargetBody.y < Body.y;
                    CharacterController2D["KeyS"] = TargetBody.y > Body.y;

                    CharacterController2D["KeyA"] = TargetBody.x < Body.x;
                    CharacterController2D["KeyD"] = TargetBody.x > Body.x;
                }

            }
        })
    }

    // noinspection JSMethodCanBeStatic
    findClosest(BotBody, RectangleOfDeathBody) {
        let x1, x2, y1, y2;
        let w, h;
        if (BotBody.x > RectangleOfDeathBody.x) {
            x1 = RectangleOfDeathBody.x; w = RectangleOfDeathBody.width; x2 = BotBody.x;
        } else {
            x1 = BotBody.x; w = BotBody.width; x2 = RectangleOfDeathBody.x;
        }
        if (BotBody.y > RectangleOfDeathBody.y) {
            y1 = RectangleOfDeathBody.y; h = RectangleOfDeathBody.height; y2 = BotBody.y;
        } else {
            y1 = BotBody.y; h = BotBody.height; y2 = RectangleOfDeathBody.y;
        }
        let a = Math.max(0, x2 - x1 - w);
        let b = Math.max(0, y2 - y1 - h);
        return Math.sqrt(a*a+b*b);
    }

    // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
    calculateAngleBetweenPoints(px, py, ax, ay) {
        return Math.atan((ax-px)/(ay-py));
    }

    // noinspection JSMethodCanBeStatic
    distanceBetweenPoints(x1,y1,x2,y2) {
        if(!x2) x2=0;
        if(!y2) y2=0;
        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    }
}