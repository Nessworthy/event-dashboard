import fs = require('fs');
import faker = require('faker');
import commander = require('commander');
import util = require('util');

import ObjectRegistry from './ObjectRegistry';
import ObjectStateStorage from './ObjectStateStorage';
import ObjectTypeEventRegistry from "./ObjectTypeEventRegistry";
import EventGenerator from "./EventGenerator";

import type {Configuration} from './types/configuration'
import type {GeneratedObjectData} from "./types/generatedObjectData";
import TokenGenerator from "./auth/TokenGenerator";
import EventDispatcher from "./EventDispatcher";

async function main() {
    const options = parseOptions(new commander.Command())

    console.debug('Loading configuration...')
    const configuration = await fetchConfiguration(options.config)
    console.debug('Configuration loaded.')

    const objectRegistry = new ObjectRegistry()
    const objectStateStorage = new ObjectStateStorage(options.cache + '/state.db')
    const objectEventRegistry = new ObjectTypeEventRegistry()
    const eventGenerator = new EventGenerator(objectRegistry, objectEventRegistry, objectStateStorage)
    const tokenGenerator = new TokenGenerator(
        configuration.auth.url,
        configuration.auth.client_id,
        configuration.auth.client_secret,
        configuration.auth.scopes
    )
    const eventDispatcher = new EventDispatcher(configuration.resource.url, tokenGenerator)

    console.debug('Generating object data...')
    const generatedObjectData = await generateObjectData(configuration, options.cache)
    console.debug('Generated.')

    console.debug('Registering object types...')
    await registerObjects(objectRegistry, generatedObjectData)
    console.debug('Registered.')

    console.debug('Registering available events for object types...')
    registerEvents(objectEventRegistry, configuration)
    console.debug('Registered.')

    await generateBackdatedEventsIfFirstTime(
        objectStateStorage,
        eventGenerator,
        eventDispatcher,
        configuration
    )

    await generateNewEvents(
        eventGenerator,
        eventDispatcher,
        configuration.events.min_seconds_between_events,
        configuration.events.max_seconds_between_events
    )
}

async function generateNewEvents(
    eventGenerator: EventGenerator,
    eventDispatcher: EventDispatcher,
    minSecondsToWait: number,
    maxSecondsToWait: number
) {
    const setTimeoutPromise = util.promisify(setTimeout);

    while (true) {
        await setTimeoutPromise(faker.datatype.number({
            min: minSecondsToWait * 1000,
            max: maxSecondsToWait * 1000
        }))
        await eventDispatcher.dispatch(await eventGenerator.generateEvent())
    }
}

async function generateBackdatedEventsIfFirstTime(
    objectStateStorage: ObjectStateStorage,
    eventGenerator: EventGenerator,
    eventDispatcher: EventDispatcher,
    configuration: Configuration
): Promise<void> {
    if (!(await objectStateStorage.isBackdated())) {
        console.info(`First run, so generating backdated events since ${configuration.events.first_generate_from}.`)
        // Backdate events for new seeds.
        const pointInTime = new Date(configuration.events.first_generate_from)

        while (pointInTime < new Date()) {

            const event = await eventGenerator.generateEvent()
            event.event_time = pointInTime

            pointInTime.setTime(
                pointInTime.getTime()
                + faker.datatype.number({
                    min: configuration.events.first_generate_min_seconds_between_events * 1000,
                    max: configuration.events.first_generate_max_seconds_between_events * 1000
                })
            )

            await eventDispatcher.dispatch(event)
        }
        await objectStateStorage.markAsBackdated()
    }
}

function registerEvents(objectEventRegistry: ObjectTypeEventRegistry, configuration: Configuration): void
{
    Object.keys(configuration.objects.types).forEach(objectType => {
        const details = configuration.objects.types[objectType]
        objectEventRegistry.registerEventsForType(objectType, details.events, details.starting_event)
    })
}

async function generateObjectData(configuration: Configuration, cacheLocation: string): Promise<GeneratedObjectData>
{

    try {
        await fs.promises.access(cacheLocation, fs.constants.X_OK)
    } catch {
        throw new Error(`Cache location at ${cacheLocation} does not exist, or is not traversable.`)
    }

    const stats = await fs.promises.lstat(cacheLocation)

    if (!stats.isDirectory()) {
        throw new Error("Cache location is not a directory.")
    }

    const cacheFilePath = `${cacheLocation}/objects.json`

    // TODO: Too messy.
    try {
        await fs.promises.access(cacheFilePath, fs.constants.W_OK)
        const configurationFile: Buffer = await fs.promises.readFile(cacheFilePath)
        return JSON.parse(configurationFile.toString('utf-8'))
    } catch {
        // *Gulp*
    }

    console.debug('No object cache file found, let\'s make one.')

    const objectData: GeneratedObjectData = {}

    Object.keys(configuration.objects.types).forEach(type => {
        objectData[type] = []

        const objectNamesToGenerate = faker.datatype.number({
            min: configuration.objects.min_unique_names_per_object_type,
            max: configuration.objects.max_unique_names_per_object_type
        })

        for (let i = 0; i < objectNamesToGenerate; i += 1) {
            const name = faker.commerce.productName()
            console.debug(`Registering new ${type} called ${name}`)
            objectData[type].push(name)
        }
    })

    console.debug(`Saving object cache data into ${cacheFilePath}`)
    const file = await fs.promises.open(cacheFilePath, 'w+')
    await file.write(JSON.stringify(objectData))
    await file.close()
    console.debug('Save complete')
    return objectData
}

async function fetchConfiguration(location: string): Promise<Configuration>
{
    const configurationFile: Buffer = await fs.promises.readFile(location)
    return JSON.parse(configurationFile.toString('utf-8'))
}

async function registerObjects(
    objectRegistry: ObjectRegistry,
    objectData: GeneratedObjectData
): Promise<void>
{
    Object.keys(objectData).forEach(type => {
        objectData[type].forEach(name => objectRegistry.addObject(type, name))
    })
}

function parseOptions(program: commander.Command): commander.OptionValues {
    program
        .option('--config <file>', 'configuration file location')
        .option('--cache <folder>', 'cache folder location')

    program.parse(process.argv)

    const options = program.opts()

    if (!options.config) {
        console.error("Missing option -c / --config <file>, please provide a configuration file location.")
        process.exit(1)
    }

    return options
}

main()
