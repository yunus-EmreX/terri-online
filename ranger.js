constructor() {
    this.startRanges = [32, 65, 191, 913, 931];
    this.endRanges = [64, 127, 688, 930, 1155];
    this.cumulativeLength = Array(this.startRanges.length + 1);
    for (let arrayIndex = 0; arrayIndex < this.cumulativeLength.length; arrayIndex++) {
        this.cumulativeLength[arrayIndex] = 0;
        for (let typeIndex = arrayIndex - 1; 0 <= typeIndex; typeIndex--) {
            this.cumulativeLength[arrayIndex] += this.endRanges[typeIndex] - this.startRanges[typeIndex];
        }
    }
}
