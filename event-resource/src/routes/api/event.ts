import express = require("express")
import uuid = require('uuid')

import {validateScopes} from "../../auth/helpers";
import {Request, Response} from "express";
import {Event} from "../../types/event";
import EventStorage from "../../storage/EventStorage";
import asyncHandler = require('express-async-handler')
import EventSubscriber from "../../EventSubscriber";

export function router (eventStorage: EventStorage, eventSubscriber: EventSubscriber) {

    const router = express.Router()

    router.post(
        '/',
        validateScopes(['event:create']),
        asyncHandler(async function (request: Request, response: Response) {
            console.debug("Event creation requested.")

            // TODO: Validation
            const event: Event = {
                event_id: uuid.v4(),
                event_name: request.body.event_name,
                event_detail: request.body.event_detail,
                event_severity: request.body.event_severity,
                event_time: new Date(request.body.event_time),
                object_name: request.body.object_name,
                object_type: request.body.object_type
            }

            console.log('Saving event to storage', event)

            const savedEvent = await eventStorage.saveEvent(event)

            console.log('Event stored')

            response.status(201)
            response.json({success: true, message: 'Event Created'})
            response.end()

            eventSubscriber.emit('event:create', savedEvent.get())
        })
    )

    return router
}


