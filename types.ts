export interface IPaginatedApiPayload<T> {
    data: T[]
    limit?: number
    offset?: number
    total?: number
}