import ClientOAuth2, {Token} from "client-oauth2";

export default class TokenGenerator {
    _auth: ClientOAuth2
    _currentToken: Token | null
    constructor(authorization_server_token_uri: string, client_id: string, client_secret: string, scopes: string[]) {
        this._auth = new ClientOAuth2({
            clientId: client_id,
            clientSecret: client_secret,
            accessTokenUri: authorization_server_token_uri,
            scopes: scopes
        })
        this._currentToken = null
    }

    async fetchToken() {

        if (this._currentToken && !this._currentToken.expired()) {
            return this._currentToken
        }

        console.info('Fetching new token.')
        this._currentToken = await this._auth.credentials.getToken()
        console.info('Token obtained.')

        return this._currentToken
    }
}
