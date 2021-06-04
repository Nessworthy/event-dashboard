type EventDefinition = {
    name: string
    detail: string
    severity: string
    leads: string[]
}

type ObjectTypeEvents = EventDefinition[]

export default class ObjectTypeEventRegistry {
    eventDefinitions: {
        [key: string]: {
            events: ObjectTypeEvents
            startingEvent: string
        }
    } = {}

    registerEventsForType(objectType: string, objectEvents: ObjectTypeEvents, startingEvent: string): void {
        this.eventDefinitions[objectType] = { events: objectEvents, startingEvent: startingEvent }
    }

    getAvailableEventsForType(objectType: string, currentState: void | string): EventDefinition[] {
        const events = this.eventDefinitions[objectType]

        if (!currentState) {
            currentState = events.startingEvent
        }

        const currentEvent = events.events.find((eventDefinition) => eventDefinition.name === currentState)

        if (!currentEvent) {
            console.warn(`Current state ${currentState} not found for object type ${objectType}`)
            return events.events
        }

        return events.events.filter((eventDefinition) => currentEvent.leads.includes(eventDefinition.name))
    }
}
