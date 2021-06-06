import WebSocket from "ws";

export function setupHeartBeat(ws: WebSocket, client_id: string)
{
    const PONG_TIMEOUT = 5000
    const HEARTBEAT_INTERVAL = 60000
    let pong = false
    let heartbeatInterval: NodeJS.Timeout

    function checkHeartBeat() {
        try {
            console.debug("Checking WS heartbeat for client", client_id)
            ws.send(JSON.stringify({type: 'heartbeat', message: 'marco'}))
        } catch (error) {
            if (ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify({type: "close", message: 'Could not send heartbeat.'}))
                ws.close(4400, 'Could not send heartbeat.')
            }
            clearInterval(heartbeatInterval)
            return
        }

        pong = false

        setTimeout(() => {
            if (!pong) {
                console.debug("Client did not respond to WS heartbeat in time, closing connection", client_id)
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({type: "close", message: 'Expected heartbeat.'}))
                    ws.close(4400, 'Expected heartbeat.')
                }
                clearInterval(heartbeatInterval)
                return
            }
        }, PONG_TIMEOUT)
    }

    ws.on('message', (data) => {
        // TODO: Validation
        const event = JSON.parse(data.toString())
        if (event.type === 'heartbeat') {
            pong = true
        }
    })

    ws.on('close', () => {
        clearInterval(heartbeatInterval)
    })

    heartbeatInterval = setInterval(checkHeartBeat, HEARTBEAT_INTERVAL)
}
