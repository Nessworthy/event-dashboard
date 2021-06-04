import level = require('level');
import {LevelDB} from "level";

export default class ObjectStateStorage {

    db: LevelDB;

    constructor(filePath: string) {
        this.db = level(filePath)
    }

    async store(objectType: string, objectName: string, state: any): Promise<void> {
        return await this.db.put(this._key(objectType, objectName), state)
    }

    async fetch(objectType: string, objectName: string): Promise<any> {
        try {
            return await this.db.get(this._key(objectType, objectName))
        } catch (error: any) {
            if (error.type === 'NotFoundError') {
                return null
            }
            throw error
        }
    }

    async isBackdated(): Promise<boolean> {
        try {
            return !!(await this.db.get("_backdated"))
        } catch (error: any) {
            if (error.type === 'NotFoundError') {
                return false
            }
            throw error
        }
    }

    async markAsBackdated(): Promise<void> {
        await this.db.put("_backdated", true)
    }

    _key(objectType: string, objectName: string) {
        return objectType + '.' + objectName
    }
}
