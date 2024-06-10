import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { FlamethrowerSimulation } from "client/objects/flamethrower-simulation";
import { Flamethrower } from "types/flamethrower";

@Controller({})
export class FlamethrowerController implements  OnInit 
{
    private flamethrowerActive = false; 

    onInit() 
    {
        UserInputService.InputBegan.Connect((input, gpe) => this.onInput(input, gpe, true));        
        UserInputService.InputEnded.Connect((input, gpe) => this.onInput(input, gpe, false));        
    }

    getFlamethrower()
    {
        const tool = Players.LocalPlayer.Character?.FindFirstAncestorWhichIsA("Tool");

        if (tool && tool.GetAttribute("IsFlamethrower"))
            return tool as Flamethrower;
    }

    private startFlamethrower()
    {
        const flamethrower = this.getFlamethrower();
        
        if (!flamethrower)
            return;
        
        this.flamethrowerActive = true;

        const flamethrowerSimulation = new FlamethrowerSimulation(flamethrower);

        while (this.flamethrowerActive)
        {
            flamethrowerSimulation.clientTick(); 
            task.wait();
        }
    }

    private stopFlamethrower()
    {
        this.flamethrowerActive = false;
    }        

    private onInput(input: InputObject, gpe: boolean, inputBegan: boolean)
    {
        if (!gpe && input.UserInputType === Enum.UserInputType.Touch)
        {
            if (inputBegan) 
                this.startFlamethrower();
            else 
                this.stopFlamethrower();
        }

    }

}