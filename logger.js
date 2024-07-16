function parseAndLogData(array) {
        let bitOffset = 0;
        const gamesCount = readBits(array, bitOffset, 5);
        bitOffset += 5;
        console.log(`Games Count: ${gamesCount}`);

        for (let i = 0; i < gamesCount; i++) {
            const id = readBits(array, bitOffset, 5);
            bitOffset += 5;
            const gamemode = readBits(array, bitOffset, 4);
            bitOffset += 4;
            const isContest = readBits(array, bitOffset, 1) === 1;
            bitOffset += 1;
            const mapID = readBits(array, bitOffset, 6);
            bitOffset += 6;
            const mapSeed = readBits(array, bitOffset, 14);
            bitOffset += 14;
            const playerBitCount = 9; // Adjust according to your protocol
            const joinCount = readBits(array, bitOffset, playerBitCount);
            bitOffset += playerBitCount;
            const maxPlayers = readBits(array, bitOffset, 9) + 1;
            bitOffset += 9;
            const timeLeft = readBits(array, bitOffset, 10);
            bitOffset += 10;
            const clanCount = 0; // Assuming clanCount is 0

            console.log(`Game ${i + 1}:`);
            console.log(`  ID: ${id}`);
            console.log(`  Game Mode: ${gamemode}`);
            console.log(`  Is Contest: ${isContest}`);
            console.log(`  Map ID: ${mapID}`);
            console.log(`  Map Seed: ${mapSeed}`);
            console.log(`  Join Count: ${joinCount}`);
            console.log(`  Max Players: ${maxPlayers}`);
            console.log(`  Time Left: ${timeLeft}`);
            console.log(`  Clan Count: ${clanCount}`);
        }
    }
