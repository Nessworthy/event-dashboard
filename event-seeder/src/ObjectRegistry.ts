export default class ObjectRegistry {
    objects: any = {}

    addObject(objectType: string, objectName: string): void
    {
        if (!(objectType in this.objects)) {
            this.objects[objectType] = []
        }

        this.objects[objectType].push(objectName)
    }

    getObjectTypes(): string[] {
        return Object.keys(this.objects)
    }

    getObjects(objectType: string): string[] {
        return this.objects[objectType]
    }
}
