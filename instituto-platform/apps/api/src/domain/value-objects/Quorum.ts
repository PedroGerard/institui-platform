
export class Quorum {
    constructor(
        public readonly presentMembers: number,
        public readonly votingMembers: number,
        public readonly requiredFraction: number // e.g. 0.5 for simple majority, 0.66 for 2/3
    ) { }

    public isSatisfied(): boolean {
        return (this.presentMembers / this.votingMembers) >= this.requiredFraction;
    }
}
