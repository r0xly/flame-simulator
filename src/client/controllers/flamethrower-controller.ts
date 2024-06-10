import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { FlamethrowerSimulation } from "client/objects/flamethrower-simulation";
import { Flamethrower } from "types/flamethrower";

@Controller({})
export class FlamethrowerController
{
    private flamethrowerActive = false; 

    getFlamethrower()
    {
        const tool = Players.LocalPlayer.Character?.FindFirstAncestorWhichIsA("Tool");

        if (tool && tool.GetAttribute("IsFlamethrower"))
            return tool as Flamethrower;
    }

    startFlamethrower()
    {
        const flamethrower = this.getFlamethrower();
        
        if (!flamethrower)
            return;

        const flamethrowerSimulation = new FlamethrowerSimulation(flamethrower);
        
        this.flamethrowerActive = true;

        while (this.flamethrowerActive)
        {
            flamethrowerSimulation.clientTick(); 
            task.wait();
        }
    }

    stopFlamethrower()
    {
        this.flamethrowerActive = false;
    }        

}