import {Event} from "./types/event";
import TokenGenerator from "./auth/TokenGenerator";
import {promisify} from "util";

const axios = require('axios').default;

const timeOutPromise = promisify(setTimeout)

export default class EventDispatcher {

    _tokenGenerator: TokenGenerator
    _resourceServerUri: string

    constructor(resourceServerUri: string, tokenGenerator: TokenGenerator) {
        this._tokenGenerator = tokenGenerator
        this._resourceServerUri = resourceServerUri
    }

    async dispatch(event: Event, _retries: number = 0): Promise<void> {
        console.debug("Dispatching new event", event)
        const token = await this._tokenGenerator.fetchToken()
        let result = null
        try {
            result = await axios.post(`${this._resourceServerUri}/api/event`, event, {
                headers: {Authorization: `Bearer ${token.accessToken}`},
                responseType: 'json',
            })
        } catch (error) {
            if (_retries > 10) {
                console.log(`Bubbling error after ${_retries} retries.`)
                throw error
            }
            console.log('Resource server might still be starting up, waiting to retry. Retries: ', _retries)
            await timeOutPromise(3000)
            return await this.dispatch(event, _retries + 1)
        }

        if (result.status === 201) {
            console.debug("Event creation was successful.")
            return
        }

        throw new Error(`Response from dispatching event was not as expected. Expected 201, received ${result.status}`)
    }
}
