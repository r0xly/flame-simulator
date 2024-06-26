import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "server/network";

export type DropableCurrency = "coins" | "gems"; 

@Service({})
export class DropableCurrencyService
{
    private avaliableCurrencyMap = new Map<Player, { [currency: string]: number }>();

    dropCurrency(player: Player, currencyType: DropableCurrency, quanity: number, position: Vector3)
    {
        const playerCurrencyMap = this.avaliableCurrencyMap.get(player);

        if (!playerCurrencyMap)
            return this.avaliableCurrencyMap.set(player, { [currencyType]: quanity });

        playerCurrencyMap[currencyType] = playerCurrencyMap[currencyType] ? playerCurrencyMap[currencyType] + quanity : quanity;
        Events.dropCurrency(player, currencyType, quanity, position);
    }

    collectCurrency(player: Player, currencyType: DropableCurrency, quanity: number)
    {
        const playerCurrencyMap = this.avaliableCurrencyMap.get(player);

        if (playerCurrencyMap && playerCurrencyMap[currencyType] && playerCurrencyMap[currencyType] >= quanity)
        {
            playerCurrencyMap[currencyType] -= quanity;
        }
    }
}