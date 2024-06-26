interface Workspace
{
    Worlds: Folder,
}   

interface ReplicatedStorage
{
    Assets: Folder &
    {
        Effects: Folder &
        {
            Misc: Folder &
            {
                Fire: ParticleEmitter,
            }
        },

        DropableCurrency: Folder,
    }
}