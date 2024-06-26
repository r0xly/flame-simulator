import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/network";
import { FlamethrowerHelper } from "shared/objects/flamethrower-helper";
import { BurnablePartService } from "./burnable-part-service";
import { Flamethrower } from "server/objects/flamethrower";


@Service({})
export class FlamethrowerService implements OnInit 
{
    activateFlamethrowers = new Map<Player, Flamethrower>();

    constructor(private burnablePartService: BurnablePartService) { }

    onInit() 
    {
        Events.tickFlamethrower.connect((player, flameDirection) => this.onFlamethrowerTick(player, flameDirection));
        Events.deactivateFlamethrower.connect((player) => this.onFlamethrowerDeactivated(player));
        Events.activateFlamethrower.connect((player) => this.onFlamethrowerActivated(player));
    }

    onFlamethrowerActivated(player: Player)
    {
        const flamethrowerTool = FlamethrowerHelper.getPlayerFlamethrowerTool(player);

        if (!flamethrowerTool)
            return;

        const flamethrower = new Flamethrower(flamethrowerTool, player, this.burnablePartService);
        flamethrower.activate();

        this.activateFlamethrowers.set(player, flamethrower);
    }

    onFlamethrowerDeactivated(player: Player)
    {
        this.activateFlamethrowers.get(player)?.deactivate();
        this.activateFlamethrowers.delete(player);
    }

    onFlamethrowerTick(player: Player, flameDirection: Vector3)
    {
        this.activateFlamethrowers.get(player)?.tick(flameDirection);
    }

}