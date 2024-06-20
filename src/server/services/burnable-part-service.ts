import { Service, OnStart, OnInit, OnTick } from "@flamework/core";
import { BurnablePart } from "shared/objects/burnable-part";

@Service({})
export class BurnablePartService implements OnTick 
{
    burningParts = new Map<BasePart, BurnablePart>();

    onTick(deltaTime: number)
    {
        this.burningParts.forEach(part => part.tick(deltaTime));
    }

    addPart(part: BasePart, burnPower: number)
    {
        if (this.burningParts.get(part))
            return this.burningParts.get(part)?.setBurnPower(burnPower);

        this.burningParts.set(part, new BurnablePart(part, burnPower));
    }

    removePart(part: BasePart)
    {
        this.burningParts.get(part)?.stopBurning();
        this.burningParts.delete(part);
    }
}