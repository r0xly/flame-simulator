import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, UserInputService } from "@rbxts/services";
import { FlamethrowerController } from "./flamethrower-controller";
import { FlamethrowerHelper } from "shared/objects/flamethrower-helper";

@Controller({})
export class InputController implements OnInit 
{
    constructor(private flamethrowerController: FlamethrowerController) { }

    onInit() 
    {
        UserInputService.InputBegan.Connect((input, gpe) => 
        {
            if (gpe) return;

            if (FlamethrowerHelper.getPlayerFlamethrowerTool(Players.LocalPlayer) && input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch)
                this.flamethrowerController.activateFlamethrower();
        });

        UserInputService.InputEnded.Connect((input, gpe) => 
        {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch)
                this.flamethrowerController.deactivateFlamethrower();
        });
    }
}