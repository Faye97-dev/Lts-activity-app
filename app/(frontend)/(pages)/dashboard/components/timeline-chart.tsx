import { useMemo } from "react"
import { AreaChart, Card, Title } from "@tremor/react"
import { Timeline } from "types/types"

const valueFormatter = function (value: number) {
  return `${value} MRU`
}

export const TimelineChart = ({ timeline }: { timeline: Timeline }) => {
  const chartData = useMemo(() => {
    return timeline.map((item) => ({
      ...item,
      "Nombre realisés": item.cumulativeTotalCreated,
    }))
  }, [timeline])

  return (
    <Card className="mt-10">
      <Title>Progression du nombre realisés</Title>
      <AreaChart
        showAnimation
        yAxisWidth={80}
        data={chartData}
        index="createdAt"
        colors={["indigo"]}
        curveType="monotone"
        valueFormatter={valueFormatter}
        intervalType="preserveStartEnd"
        categories={["Nombre realisés"]}
      />
    </Card>
  )
}
