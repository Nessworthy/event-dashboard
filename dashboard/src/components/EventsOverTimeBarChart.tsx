import { ResponsiveBar } from '@nivo/bar'

const data = [
    {
        "country": "AD",
        "hot dog": 199,
        "hot dogColor": "hsl(23, 70%, 50%)",
        "burger": 86,
        "burgerColor": "hsl(29, 70%, 50%)",
        "sandwich": 169,
        "sandwichColor": "hsl(350, 70%, 50%)",
        "kebab": 42,
        "kebabColor": "hsl(169, 70%, 50%)",
        "fries": 199,
        "friesColor": "hsl(93, 70%, 50%)",
        "donut": 182,
        "donutColor": "hsl(90, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 143,
        "hot dogColor": "hsl(163, 70%, 50%)",
        "burger": 49,
        "burgerColor": "hsl(341, 70%, 50%)",
        "sandwich": 112,
        "sandwichColor": "hsl(254, 70%, 50%)",
        "kebab": 153,
        "kebabColor": "hsl(177, 70%, 50%)",
        "fries": 86,
        "friesColor": "hsl(303, 70%, 50%)",
        "donut": 135,
        "donutColor": "hsl(311, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 120,
        "hot dogColor": "hsl(121, 70%, 50%)",
        "burger": 31,
        "burgerColor": "hsl(329, 70%, 50%)",
        "sandwich": 157,
        "sandwichColor": "hsl(132, 70%, 50%)",
        "kebab": 68,
        "kebabColor": "hsl(247, 70%, 50%)",
        "fries": 112,
        "friesColor": "hsl(323, 70%, 50%)",
        "donut": 112,
        "donutColor": "hsl(165, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 119,
        "hot dogColor": "hsl(76, 70%, 50%)",
        "burger": 159,
        "burgerColor": "hsl(273, 70%, 50%)",
        "sandwich": 199,
        "sandwichColor": "hsl(263, 70%, 50%)",
        "kebab": 159,
        "kebabColor": "hsl(18, 70%, 50%)",
        "fries": 176,
        "friesColor": "hsl(195, 70%, 50%)",
        "donut": 130,
        "donutColor": "hsl(201, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 114,
        "hot dogColor": "hsl(85, 70%, 50%)",
        "burger": 37,
        "burgerColor": "hsl(284, 70%, 50%)",
        "sandwich": 98,
        "sandwichColor": "hsl(11, 70%, 50%)",
        "kebab": 44,
        "kebabColor": "hsl(346, 70%, 50%)",
        "fries": 67,
        "friesColor": "hsl(268, 70%, 50%)",
        "donut": 140,
        "donutColor": "hsl(134, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 192,
        "hot dogColor": "hsl(104, 70%, 50%)",
        "burger": 165,
        "burgerColor": "hsl(178, 70%, 50%)",
        "sandwich": 200,
        "sandwichColor": "hsl(132, 70%, 50%)",
        "kebab": 134,
        "kebabColor": "hsl(298, 70%, 50%)",
        "fries": 106,
        "friesColor": "hsl(352, 70%, 50%)",
        "donut": 33,
        "donutColor": "hsl(356, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 167,
        "hot dogColor": "hsl(242, 70%, 50%)",
        "burger": 30,
        "burgerColor": "hsl(166, 70%, 50%)",
        "sandwich": 38,
        "sandwichColor": "hsl(158, 70%, 50%)",
        "kebab": 183,
        "kebabColor": "hsl(332, 70%, 50%)",
        "fries": 72,
        "friesColor": "hsl(18, 70%, 50%)",
        "donut": 89,
        "donutColor": "hsl(300, 70%, 50%)"
    }
]

const MyResponsiveBar = ( data: any) => (
    <ResponsiveBar
        data={data}
        keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut' ]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

export default function EventsOverTimeBarChart(props: any) {
    return MyResponsiveBar(data)
}
