export class EventStreamSource extends EventTarget {
    _ws: WebSocket | null = null

    constructor() {
        super();
        if (!this._ws || this._ws.readyState === WebSocket.CLOSED) {
            this._connect()
        }
    }

    _connect(): void {
        console.log('Connecting to event stream...')
        const ws = new WebSocket('ws://127.0.0.1:8080/ws/events')
        this._ws = ws
        ws.addEventListener('message', this._onIncomingMessage.bind(this))
        ws.addEventListener('close', this._handleClose.bind(this))
    }

    _disconnect(): void {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.close(4000, 'Requested by server.')
        }
    }

    _handlePing(): void {
        if (this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(JSON.stringify({type: 'ping', message: 'polo'}))
        }
    }

    _handleClose(): void {
        if (this._ws) {
            this._ws.removeEventListener('message', this._onIncomingMessage.bind(this))
        }
        // Attempt reconnect.
        console.info('Connection closed. Attempting reconnect.')
        setTimeout(this._connect.bind(this), 3000)
    }

    _onIncomingMessage(rawMessage: MessageEvent) {
        const message = JSON.parse(rawMessage.data)
        switch (message.type) {
            case 'heartbeat':
                this._handlePing()
                break
            case 'event':
                const event = message.message
                event.event_timestamp = new Date(event.event_time).getTime()
                console.log(event)
                this.dispatchEvent(new CustomEvent('event', {
                    detail: event
                } ))
                break
            case 'close':
                console.warn('About to close WS connection.', message.message)
                this._disconnect()
                break
        }
    }
}
