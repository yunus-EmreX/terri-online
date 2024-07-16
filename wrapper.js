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
