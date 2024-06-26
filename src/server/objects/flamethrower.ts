import { FlamethrowerTool } from "types/flamethrower";
import { Players, Workspace } from "@rbxts/services";
import { Dependency } from "@flamework/core";
import { BurnablePartService } from "server/services/burnable-part-service";

const getFlamethrowerAttribute = (tool: FlamethrowerTool, attribute: string) =>
    tool.GetAttribute(attribute) ? (tool.GetAttribute(attribute) as number) : error(`Failed to initilize flamethrower ${tool.Name}. Attribute ${attribute} does not exist.`);

const worlds = Workspace.FindFirstChild("Worlds") as Folder;

const flamethrowerRaycastParam = new RaycastParams();
flamethrowerRaycastParam.FilterType = Enum.RaycastFilterType.Include;
flamethrowerRaycastParam.FilterDescendantsInstances = [Workspace.FindFirstChild("Worlds") as Folder];

export class Flamethrower
{
    private previousTickParts: BasePart[] = [];

    fireParticle: ParticleEmitter;
    smokeParticle: ParticleEmitter;
    hole: Attachment;

    gasConsumptionRate: number;
    areaOfEffect: number;
    range: number;
    power: number;

    constructor(private tool: FlamethrowerTool, private owner: Player, private burnablePartService: BurnablePartService)
    {
        this.gasConsumptionRate = getFlamethrowerAttribute(tool, "GasConsumptionRate");
        this.areaOfEffect = getFlamethrowerAttribute(tool, "AreaOfEffect");
        this.range = getFlamethrowerAttribute(tool, "Range");
        this.power = getFlamethrowerAttribute(tool, "Power");

        this.hole = tool.Handle.Hole;
        this.fireParticle = tool.Handle.Hole.Fire;
        this.smokeParticle = tool.Handle.Hole.Smoke;
    }

    activate()
    {
        this.fireParticle.Enabled = true;
        this.smokeParticle.Enabled = true;
    }

    deactivate()
    {

        this.fireParticle.Enabled = false;
        this.smokeParticle.Enabled = false;

        this.previousTickParts.forEach(part => this.burnablePartService.removePart(part));
        this.previousTickParts = [];
    }

    tick(flameDirection: Vector3)
    {
        const origin = this.tool.Handle.Hole.WorldPosition;
        const direction = flameDirection.Unit.mul(this.range);
        
        const raycastResult = Workspace.Raycast(origin, direction, flamethrowerRaycastParam);
        const hitPosition = raycastResult?.Position || origin.add(direction);
        
        const parts = Workspace.GetPartBoundsInRadius(hitPosition, this.areaOfEffect)
            .filter(part => part.IsDescendantOf(worlds))

        
        parts.forEach(part => 
        {
            const distanceFromCenter = hitPosition.sub(part.Position).Magnitude;
            const power = this.power - (this.power / 2) * (distanceFromCenter / this.areaOfEffect);

            this.burnablePartService.addPart(part, power, this.owner);
        });

        this.previousTickParts = this.previousTickParts.filter(part => parts.indexOf(part) === -1)
        this.previousTickParts.forEach(part => this.burnablePartService.removePart(part));
        this.previousTickParts = parts;

        const displacement = this.hole.WorldPosition.sub(hitPosition).Magnitude;
        const fireTime = displacement / this.fireParticle.Speed.Max;    
        const smokeTime = displacement / this.smokeParticle.Speed.Max;


        const lookAtCFrame = CFrame.lookAt(this.hole.WorldPosition, hitPosition);
        this.hole.CFrame = (this.hole.Parent as BasePart).CFrame.Inverse().mul(lookAtCFrame);

        this.fireParticle.Lifetime = new NumberRange(fireTime / 2.1, fireTime * 1.4);
        this.smokeParticle.Lifetime = new NumberRange(smokeTime / 2.1, smokeTime * 1.4);

    }

}