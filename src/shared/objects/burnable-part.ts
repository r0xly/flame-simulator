import { Debris, HapticService, ReplicatedStorage } from "@rbxts/services";
import spr from "@rbxts/spr";

const BURNT_COLOR = Color3.fromRGB(0, 0, 0);

export class BurnablePart
{
    elapsedTime = 0;
    destroying = false;
    particleEmitter: ParticleEmitter;

    constructor(private part: BasePart, private burnPower: number) 
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

    setBurnPower(burnPower: number)
    {
        this.burnPower = burnPower;
    }

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

    setHealth(value: number)
    {
        this.part.SetAttribute("Health", value);
    }

    tick(deltaTime: number)
    {
        if (this.destroying)
            return;

        const originalColor = this.getOriginalColor();
        const maxHealth = this.getMaxHealth();
        const health = this.getHealth();

        this.elapsedTime += deltaTime;

        this.setHealth(health - healthCurve(this.elapsedTime) * this.burnPower);
        this.part.Color = originalColor.Lerp(BURNT_COLOR, (maxHealth - health) / maxHealth * 0.85)
        
        if (health <= 0)
            this.destory();
    }

    destory()
    {
        if (this.destroying)
            return;

        this.destroying = true;

        spr.target(this.part, 0.5, 2.5, {
            Transparency: 0.99,
            Size: new Vector3(2.5, 2.5, 2.5),
        })

        spr.completed(this.part, () => this.part.Destroy());
    }
}

const healthCurve = (x: number) => 2 / 2000 * math.pow(x + 1, 1.5)