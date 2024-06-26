import { Controller, OnStart, OnInit, OnTick } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Events } from "client/network";

const COLLECTION_DISTANCE = 10;
const player = Players.LocalPlayer;

interface DropableCurrency 
{
    part: BasePart, 
    currencyType: string,
    collectAnimationPlaying: boolean,
    elapsedTime: number,
    direction: Vector3,
    distance: number,
    quanity: number 
}

@Controller({})
export class DropableCurrencyController implements OnInit, OnTick {
    private droppedCurrencies = new Set<DropableCurrency>();

    onInit() 
    {
        Events.dropCurrency.connect((currencyType, quanity, position) => this.dropCurrency(currencyType, quanity, position));
    }

    onTick(deltaTime: number) 
    {
        const humanoidRootPart = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;

        if (!humanoidRootPart)
            return;
       
        for (const currency of this.droppedCurrencies)
        {
            const distance = currency.part.Position.sub(humanoidRootPart.Position).Magnitude;

            if (distance < 1)
            {
                this.droppedCurrencies.delete(currency);
                currency.part.Destroy();
            }
            else if (currency.collectAnimationPlaying)
            {
                currency.elapsedTime += deltaTime;
                currency.distance -= math.pow(currency.elapsedTime, 3) * deltaTime * 2500
                currency.part.Position = humanoidRootPart.Position.add(currency.direction.mul(currency.distance));
            }
            else if (distance < COLLECTION_DISTANCE && !currency.collectAnimationPlaying)
            {
                currency.direction = currency.part.Position.sub(humanoidRootPart.Position).Unit;
                currency.collectAnimationPlaying = true;
                currency.distance = distance;
                currency.part.AssemblyLinearVelocity = Vector3.zero;
                currency.part.Anchored = true;
                currency.part.CanCollide = false;
            }


        }
    }

    private dropCurrency(currencyType: string, quanity: number, position: Vector3)
    {
        let template = ReplicatedStorage.Assets.DropableCurrency.FindFirstChild(currencyType) as BasePart;

        assert(template, `Could not find ${currencyType} currency template.`)

        const currency = template.Clone();
        currency.Parent = Workspace;
        currency.Position = position;

        const randomX = [math.random(-25, -10), math.random(10, 25)];
        const randomZ = [math.random(-25, -10), math.random(10, 25)];

        const velocity = new Vector3(randomX[math.random(1, 2)], math.random(10, 30), randomZ[math.random(1, 2)]);
        currency.AssemblyLinearVelocity = velocity;

        this.droppedCurrencies.add(
        {
            part: currency,
            currencyType: currencyType,
            collectAnimationPlaying: false,
            elapsedTime: 0,
            direction: Vector3.zero,
            distance: 0,
            quanity: quanity 
        });
    }

    
}