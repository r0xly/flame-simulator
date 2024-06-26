import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { FlamethrowerHelper } from "shared/objects/flamethrower-helper";
import { FlamethrowerTool } from "types/flamethrower";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();


@Controller({})
export class FlamethrowerController
{
    private flamethrowerActive = false; 

    activateFlamethrower()
    {
        if (this.flamethrowerActive)
            return;

        const tool = FlamethrowerHelper.getPlayerFlamethrowerTool(player);
        assert(tool, "Could not start flamethrower. Flamethrower tool in not equipped.");
        
        Events.activateFlamethrower.fire();
        this.flamethrowerActive = true;

        while (this.flamethrowerActive)
        {
            const direction = mouse.Hit.Position.sub(tool.Handle.Hole.WorldPosition).Unit;
            Events.tickFlamethrower.fire(direction);            
            task.wait();
        }
    }

    deactivateFlamethrower()
    {
        Events.deactivateFlamethrower.fire();

        this.flamethrowerActive = false;
    }        

}