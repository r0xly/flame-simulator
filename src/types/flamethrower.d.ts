export type FlamethrowerTool = Tool &
{
    Handle: BasePart &
    {
        Hole: Attachment &
        {
            Smoke: ParticleEmitter,
            Fire: ParticleEmitter,
        }
    },
}