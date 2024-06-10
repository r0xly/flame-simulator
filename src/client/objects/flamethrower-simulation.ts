import { Players, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { Flamethrower } from "types/flamethrower";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

const worlds = Workspace.FindFirstChild("Worlds") as Folder;

const flamethrowerRaycastParam = new RaycastParams();
flamethrowerRaycastParam.FilterType = Enum.RaycastFilterType.Include;
flamethrowerRaycastParam.FilterDescendantsInstances = [worlds];

export class FlamethrowerSimulation
{
    private range: number;
    private areaOfAffect: number;
    private handle: BasePart;

    constructor(flamethorwer: Flamethrower)
    {
        this.areaOfAffect = flamethorwer.GetAttribute("AreaOfEffect") as number;
        this.range = flamethorwer.GetAttribute("Range") as number;
        this.handle = flamethorwer.Handle;
    }

    clientTick()
    {
        const origin = this.handle.Position;
        const direction = origin
            .sub(mouse.Hit.Position).Unit
            .mul(this.range); 

        const raycastResults = Workspace.Raycast(this.handle.Position, direction, flamethrowerRaycastParam);
        const hitPosition = raycastResults?.Position || origin.add(direction);

        const parts: BasePart[] = [];

        for (const part of Workspace.GetPartBoundsInRadius(hitPosition, this.areaOfAffect))
        {
            if (part.IsDescendantOf(worlds))
                parts.push(part);
        }

        Events.burnParts(parts);
    }

    serverTick()
    {

    }
}