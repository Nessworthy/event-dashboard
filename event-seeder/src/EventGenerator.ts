import ObjectRegistry from "./ObjectRegistry";
import faker = require('faker');
import ObjectTypeEventRegistry from "./ObjectTypeEventRegistry";
import {Event} from "./types/event";
import ObjectStateStorage from "./ObjectStateStorage";

export default class EventGenerator {

    registry: ObjectRegistry
    eventRegistry: ObjectTypeEventRegistry
    objectStateStorage: ObjectStateStorage

    constructor(registry: ObjectRegistry, eventRegistry: ObjectTypeEventRegistry, objectStateStorage: ObjectStateStorage) {
        this.registry = registry
        this.eventRegistry = eventRegistry
        this.objectStateStorage = objectStateStorage
    }

    async generateEvent(): Promise<Event> {
        const objectType = faker.random.arrayElement(this.registry.getObjectTypes())
        const objectName = faker.random.arrayElement(this.registry.getObjects(objectType))

        const currentState: string | undefined = await this.objectStateStorage.fetch(objectType, objectName)

        const availableEvents = this.eventRegistry.getAvailableEventsForType(objectType, currentState)

        const chosenEvent = faker.random.arrayElement(availableEvents)

        if (!chosenEvent) {
            console.error(`No chosen event found for ${objectType} - ${objectName} in state ${currentState}`)
        }

        await this.objectStateStorage.store(objectType, objectName, chosenEvent.name)

        return {
            "event_name": chosenEvent.name,
            "event_detail": chosenEvent.detail,
            "event_time": new Date(),
            "event_severity": chosenEvent.severity,
            "object_type": objectType,
            "object_name": objectName
        }

    }

}
