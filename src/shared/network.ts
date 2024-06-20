import { Networking } from "@flamework/networking";

interface ClientToServerEvents 
{
    tickFlamethrower(flameDirection: Vector3): void,
    deactivateFlamethrower(): void,
    activateFlamethrower(): void,
}

interface ServerToClientEvents {}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
