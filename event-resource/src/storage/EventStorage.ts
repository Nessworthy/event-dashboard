import {Connection} from "mysql2/promise";
import {Event} from "../types/event";
import {Model, ModelCtor} from "sequelize";

export default class EventStorage {

    _modelCtor

    constructor(modelCtor: ModelCtor<Model<any, any>> ) {
        this._modelCtor = modelCtor
    }

    async saveEvent(event: Event): Promise<Model> {

        return await this._modelCtor.create(event)

    }
}
