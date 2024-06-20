import { FlamethrowerTool } from "types/flamethrower";

export class FlamethrowerHelper
{
    static getPlayerFlamethrowerTool(player: Player)
    {
        const tool = player.Character?.FindFirstChildWhichIsA("Tool");

        if (tool?.GetAttribute("IsFlamethrower"))
            return tool as FlamethrowerTool;
    }
}