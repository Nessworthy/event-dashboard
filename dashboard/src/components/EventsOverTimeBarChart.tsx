import { ResponsiveBar } from '@nivo/bar'
import {gql, useQuery} from "@apollo/client";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";

const MyResponsiveBar = ( data: any, keys: string[], indexBy: string, colors: any ) => (

    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={(bar) => colors[bar.id]}
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
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date (Starting at)',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Total Events',
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

const GET_AGGREGATION_QUERY = gql`
query($from: String!, $to: String!, $period: AggregationPeriod!, $split: AggregationSubField!) {
  eventAggregationOverTime(from:$from, to:$to, period:$period, split:$split) {
    buckets {
      key,
      buckets {
        key,
        count
      }
    }
  }
}`

export default function EventsOverTimeBarChart(props: any) {
    const { loading, error, data } = useQuery(
        GET_AGGREGATION_QUERY, {
            variables: {
                from: props.from.format(),
                to: props.to.format(),
                period: props.period,
                split: props.by
            }
        }
    )

    if (loading) {
        return <Spinner animation="border" variant="primary" />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }



    const composedData: any[] = []

    data.eventAggregationOverTime.buckets.forEach((bucket: any) => {
        const parts: any = {}
        bucket.buckets.forEach((subBucket: any) => {
            parts[subBucket.key] = subBucket.count
            //parts[`${subBucket.key}Color`] = colors[subBucket.key]
        })

        composedData.push({
            date: moment(new Date(bucket.key)).format('YYYY-MM-DD'),
            information: 0,
            //informationColor:colors['information'],
            warning: 0,
            //warningColor: colors['warning'],
            error: 0,
            //errorColor: colors['error'],
            critical: 0,
            //criticalColor: colors['critical'],
            ...parts
        })
    })

    console.log(composedData.reverse())
    const colors: any = {
        "information": "#03a9f4",
        "warning": "#ffc400",
        "error": "#ff9100",
        "critical": "#f44336"
    }
    return MyResponsiveBar(composedData, Object.keys(colors), "date", colors)
}
