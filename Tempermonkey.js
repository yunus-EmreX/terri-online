// ==UserScript==
// @name         readbitter
// @namespace    http://tampermonkey.net/
// @version      2024-07-16
// @description  try to take over the world!
// @author       ShellBee
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const arrayBuffer = event.data;
                const array = new Uint8Array(arrayBuffer);
                console.log('Received ArrayBuffer:', array);
                logLobbyGameInfo(array);
            }
        });

        return ws;
    };

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

    function logLobbyGameInfo(array) {
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
            const clanCount = 0;

            console.log({
                id,
                gamemode,
                isContest,
                mapID,
                mapSeed,
                joinCount,
                maxPlayers,
                timeLeft,
                clanCount
            });
        }
    }
})();
