
export class DateRange {
    constructor(
        public readonly start: Date,
        public readonly end: Date
    ) {
        if (this.start > this.end) {
            throw new Error("Start date cannot be after end date");
        }
    }

    public overlaps(other: DateRange): boolean {
        return this.start < other.end && other.start < this.end;
    }

    public contains(date: Date): boolean {
        return date >= this.start && date <= this.end;
    }
}
