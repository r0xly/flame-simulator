import { Networking } from "@flamework/networking";

interface ClientToServerEvents 
{
    tickFlamethrower(flameDirection: Vector3): void,
    deactivateFlamethrower(): void,
    activateFlamethrower(): void,

    collectCurrency(currencyType: string, quanity: number): void,
}

interface ServerToClientEvents 
{
    dropCurrency(currencyType: string, quanity: number, position: Vector3): void,
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
