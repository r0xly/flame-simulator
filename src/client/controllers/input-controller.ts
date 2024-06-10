import { Controller, OnStart, OnInit } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { FlamethrowerController } from "./flamethrower-controller";

@Controller({})
export class InputController implements OnInit 
{
    constructor(private flamethrowerController: FlamethrowerController) { }

    onInit() 
    {
        UserInputService.InputBegan.Connect((input, gpe) => 
        {
            if (!gpe) return;

            if (input.UserInputType === Enum.UserInputType.Touch)
                this.flamethrowerController.startFlamethrower();
        });

        UserInputService.InputEnded.Connect((input, gpe) => 
        {
            if (!gpe) return;

            if (input.UserInputType === Enum.UserInputType.Touch)
                this.flamethrowerController.stopFlamethrower();
        });
    }
}