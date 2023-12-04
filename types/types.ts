import { MetricProps } from "@tremor/react"

export interface IPaginatedApiPayload<T> {
  data: T[]
  limit?: number
  offset?: number
  total?: number
}

export type MetricsCard = {
  title: string
  value: number
  color: MetricProps["color"]
}
export type Timeline = {
  id: string
  createdAt: string
  activityId: string
  departmentId: string
  totalCreated: number
  cumulativeTotalCreated: number
}[]
export type Kpi = {
  departmentCount: number | null
  activitiesCount: number | null
  totalTarget: number
  totalCreated: number
}
export type KpisPayloadType = {
  kpis: Kpi
  timeline: Timeline
}
