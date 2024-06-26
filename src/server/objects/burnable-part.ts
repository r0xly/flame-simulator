import { Dependency } from "@flamework/core";
import { Debris, HapticService, ReplicatedStorage } from "@rbxts/services";
import spr from "@rbxts/spr";
import { DropableCurrencyService } from "server/services/dropable-currency-service";

const BURNT_COLOR = Color3.fromRGB(0, 0, 0);

export class BurnablePart
{
    elapsedTime = 0;
    destroying = false;
    particleEmitter: ParticleEmitter;

    constructor(private part: BasePart, private burnPower: number, private owner: Player) 
    {
        let particleEmitter = part.FindFirstChild("Fire");

        if (!particleEmitter || !particleEmitter.IsA("ParticleEmitter"))
        {
            particleEmitter = ReplicatedStorage.Assets.Effects.Misc.Fire.Clone();
            particleEmitter.Parent = part;
        }

        this.particleEmitter = particleEmitter as ParticleEmitter;
        this.particleEmitter.Enabled = true;
    }


    stopBurning()
    {
        this.particleEmitter.Enabled = false;
    }

    setHealth = (value: number) => this.part.SetAttribute("Health", value);

    setBurnPower = (burnPower: number) => this.burnPower = burnPower;

    getHealth()
    {
        let health = this.part.GetAttribute("Health");

        if (!health)
            health = this.getMaxHealth();
            
        this.part.SetAttribute("Health", health);

        return health as number;
    }

    getMaxHealth()
    {
        let maxHealth = this.part.GetAttribute("MaxHealth");

        if (!maxHealth)
            maxHealth = 100;

        this.part.SetAttribute("MaxHealth", maxHealth);

        return maxHealth as number;
    }

    getOriginalColor()
    {
        let color = this.part.GetAttribute("OriginalColor");

        if (!color)
            color = this.part.Color;

        this.part.SetAttribute("OriginalColor", color);

        return color as Color3;
    }


    tick(deltaTime: number)
    {
        if (this.destroying)
            return;

        
        const originalColor = this.getOriginalColor();
        const maxHealth = this.getMaxHealth();
        const health = this.getHealth();
        
        if (health <= 0)
        {
            this.destory();
            this.destroying = true;
        }

        this.elapsedTime += deltaTime;

        this.setHealth(health - healthCurve(this.elapsedTime) * this.burnPower);
        this.part.Color = originalColor.Lerp(BURNT_COLOR, (maxHealth - health) / maxHealth * 0.85)
        
    }

    destory()
    {
        if (this.destroying)
            return;
        
        this.destroying = true;

        this.stopBurning();
        this.part.CanCollide = false;
        
        spr.target(this.part, 0.5, 2.5, 
        {
            Transparency: 0.99,
            Size: this.part.Size.mul(0.5),
        });

        const dropableCurrencyService = Dependency<DropableCurrencyService>();

        dropableCurrencyService.dropCurrency(this.owner, "coins", math.random(10, 200), this.part.Position);

        if (math.random(1, 20) === 1)
            dropableCurrencyService.dropCurrency(this.owner, "gems", math.random(10, 200), this.part.Position);

        spr.completed(this.part, () => this.part.Destroy());
    }
}

const healthCurve = (x: number) => 2 / 2000 * math.pow(x + 1, 1.5)