export type Configuration = {
    auth: {
        url: string,
        client_id: string,
        client_secret: string,
        scopes: string[]
    },
    resource: {
        url: string
    },
    events: {
        min_seconds_between_events: number,
        max_seconds_between_events: number,
        first_generate_from: number,
        first_generate_min_seconds_between_events: number,
        first_generate_max_seconds_between_events: number
    },
    objects: {
        types: {
            [key: string]: {
                starting_event: string,
                events: [{
                    name: string
                    detail: string
                    severity: string
                    leads: string[]
                }]
            }
        },
        min_unique_names_per_object_type: number,
        max_unique_names_per_object_type: number
    }
}
