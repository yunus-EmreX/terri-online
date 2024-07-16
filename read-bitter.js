 // Function to read bits from an array
    function readBits(array, bitOffset, numBits) {
        let value = 0;
        for (let i = 0; i < numBits; i++) {
            const byteIndex = Math.floor((bitOffset + i) / 8);
            const bitIndex = 7 - ((bitOffset + i) % 8);
            const bit = (array[byteIndex] >> bitIndex) & 1;
            value = (value << 1) | bit;
        }
        return value;
    }
