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
    const logBuffer = [];
    let lastLogTime = 0;

    window.WebSocket = function(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);

        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const arrayBuffer = event.data;
                const array = new Uint8Array(arrayBuffer);
                logBuffer.push(parseArrayBuffer(array));
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

    function parseArrayBuffer(array) {
        let bitOffset = 0;
        const gamesCount = readBits(array, bitOffset, 5);
        bitOffset += 5;

        const games = [];
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
            const playerBitCount = 9;
            const joinCount = readBits(array, bitOffset, playerBitCount);
            bitOffset += playerBitCount;
            const maxPlayers = readBits(array, bitOffset, 9) + 1;
            bitOffset += 9;
            const timeLeft = readBits(array, bitOffset, 10);
            bitOffset += 10;
            const clanCount = 0;

            games.push({
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

        // Parse additional fields: playerId, mwCode, elo
        const playerId = readBits(array, bitOffset, 5);  // Assuming playerId is 5 bits
        bitOffset += 5;

        const mwCode = readBits(array, bitOffset, 12);  // Assuming mwCode is 12 bits
        bitOffset += 12;

        const elo = readBits(array, bitOffset, 9);  // Assuming elo is 9 bits
        bitOffset += 9;

        return {
            games,
            playerId,
            mwCode,
            elo
        };
    }

    function logBufferedData() {
        const currentTime = Date.now();
        if (currentTime - lastLogTime >= 5000 && logBuffer.length > 0) {
            console.log('Buffered Data:', logBuffer);
            logBuffer.length = 0; // Clear the buffer
            lastLogTime = currentTime;
        }
    }

    setInterval(logBufferedData, 1000);
})();
