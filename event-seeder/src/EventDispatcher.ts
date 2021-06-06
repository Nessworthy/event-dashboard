import {Event} from "./types/event";
import TokenGenerator from "./auth/TokenGenerator";

const axios = require('axios').default;

export default class EventDispatcher {

    _tokenGenerator: TokenGenerator
    _resourceServerUri: string

    constructor(resourceServerUri: string, tokenGenerator: TokenGenerator) {
        this._tokenGenerator = tokenGenerator
        this._resourceServerUri = resourceServerUri
    }

    async dispatch(event: Event): Promise<void> {
        console.debug("Dispatching new event", event)
        const token = await this._tokenGenerator.fetchToken()
        const result = await axios.post(`${this._resourceServerUri}/api/event`, event, {
            headers: { Authorization: `Bearer ${token.accessToken}` },
            responseType: 'json',
        })

        if (result.status === 201) {
            console.debug("Event creation was successful.")
            return
        }

        throw new Error(`Response from dispatching event was not as expected. Expected 201, received ${result.status}`)
    }
}
