
import {NextFunction, Request, Response} from 'express';
import {WebsocketRequestHandler} from "express-ws";

/**
 * Extend passport's AuthInfo interface to support passing scopes.
 */
declare global {
    namespace Express {
        interface AuthInfo {
            scope: string[] | null
        }
    }
}

export function validateScopesWs(scopes: string[]) {
    let func : WebsocketRequestHandler
    func = function (ws, req, next) {
        if (!req.authInfo) {
            console.debug('WS Request failed - client was not authenticated.')
            ws.send(JSON.stringify({type: "close", message: "Unauthorized (unauthenticated)"}))
            ws.close(4401, 'Forbidden (Not authenticated)')
            return
        }

        if (!req.authInfo.scope) {
            console.debug('Request failed - client has no scopes.')
            ws.send(JSON.stringify({type: "close", message: "Unauthorized (permission denied)"}))
            ws.close(4401, 'Forbidden (No scopes)')
            return
        }

        const scopesUserHas = req.authInfo.scope

        const scoped = scopes.every(scope => scopesUserHas.includes(scope))

        if (!scoped) {
            console.debug('Request failed - client was missing one or more scopes.')
            ws.send(JSON.stringify({type: "close", message: "Unauthorized (permission denied)"}))
            ws.close(4401, 'Forbidden (Missing one or more Scopes)')
            return
        }

        return next();
    }
    return func
}

export function validateScopes(scopes: string[])
{
    return function(req: Request, res: Response, next: NextFunction) {

        // access control middleware to check for required scope
        if (!req.authInfo) {
            res.statusCode = 403;
            console.debug('Request failed - client was not authenticated.')
            return res.end('Forbidden (Not authenticated)');
        }

        if (!req.authInfo.scope) {
            res.statusCode = 403;
            console.debug('Request failed - client has no scopes.')
            return res.end('Forbidden (No scopes)');
        }

        const scopesUserHas = req.authInfo.scope

        const scoped = scopes.every(scope => scopesUserHas.includes(scope))

        if (!scoped) {
            res.statusCode = 403;
            console.debug('Request failed - client was missing one or more scopes.')
            return res.end('Forbidden (Missing one or more Scopes)');
        }

        return next();
    }
}
