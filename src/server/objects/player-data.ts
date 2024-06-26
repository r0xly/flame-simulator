const playerDataMap = new Map<Player, PlayerData>();

export class PlayerData
{
    static GetData(player: Player)
    {  
        return playerDataMap.get(player);
    }

    constructor(private player: Player)
    {
        player.SetAttribute("Gas", 100);
        player.SetAttribute("GasCapacity", 100);
        
        playerDataMap.
    }


    setGas()
    {

    }

    getGas()
    {

    }

    getGasCapacity()
    {
        return thi
    }

}