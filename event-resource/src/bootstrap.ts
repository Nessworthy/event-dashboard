// External components
import express = require('express')
import passport = require('passport')
import passportBearer = require('passport-http-bearer')
import http = require('http')
import uuid = require('uuid')

// Servers
const { ApolloServer } = require('apollo-server-express'); // Using imports breaks this on applyMiddleware.
import { Application } from "express-ws"

// Storage
import { createDb } from "./database"

// GraphQL Definitions
import { defineGraphQLEvents } from './graphql/events'

// Types
import { Event } from "./types/event"

// Helpers
import { setupHeartBeat } from './ws/heartbeat'

// Routes
import { router as apiEventRouter } from './routes/api/event'

// Misc
import EventSubscriber from './EventSubscriber'
import EventStorage from './storage/EventStorage'
import {validateScopes} from './auth/helpers';
import {gql, PubSub} from "apollo-server-express";


export async function bootstrap(app: express.Application, port: number): Promise<void> {

    app.use(express.json())

    // Storage
    // TODO: Config

    const { sequelize } = await createDb()

    const eventSubscriber = new EventSubscriber()
    const eventStorage = new EventStorage(sequelize.models.Event);

    // Passport
    passport.use(new passportBearer.Strategy(function(token: string, done) {
        // TODO: Swap stub out
        return done(null, {}, {scope: ['event:create']})
    }));

    // API Routes

    app.use(
        '/api/event',
        passport.authenticate('bearer', { session: false }),
        apiEventRouter(eventStorage, eventSubscriber)
    )

    // GraphQL
    const gQLEventSubscriber = new PubSub()
    eventSubscriber.on('event:create', function(event: Event) {
        console.log('CREATE EVENT RECEIVED, PUBLISHING.')
        gQLEventSubscriber.publish('EVENT_RECEIVED', {
            eventReceived: event
        })
    })
    const apolloServer = new ApolloServer({
        modules: [
            defineGraphQLEvents(sequelize, gQLEventSubscriber)
        ]
    })
    // await apolloServer.start()

    apolloServer.applyMiddleware({
        app: app,
        path: "/graphql"
    })
    const httpServer = http.createServer(app)
    apolloServer.installSubscriptionHandlers(httpServer)

    // WSS

    /*app.ws('/ws/events',
        // TODO: WS Auth please?
        //passport.authenticate('bearer', { session: false }),
        //validateScopesWs(['event:read']),
        (async (ws/!*, req*!/) => {

            const client_id = uuid.v4()

            console.debug("WS client connected", client_id)

            ws.send(JSON.stringify({type: 'system', message: 'Hello!'}))

            setupHeartBeat(ws,client_id)

            const listener = (event: Event) => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(JSON.stringify({type: 'event', message: event}))
                }
            }
            eventSubscriber.on('event:create', listener)

            ws.on('close', () => {
                console.debug("WS client disconnected", client_id)
                eventSubscriber.off('event:create', listener)
            })
        })
    )*/

    await new Promise(resolve => httpServer.listen(port, () => resolve(true)));
    console.log(`Server ready! at http://localhost:${port}${apolloServer.graphqlPath}`);


}

