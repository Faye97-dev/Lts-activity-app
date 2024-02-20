export interface IClientApiParams<T> {
  endpoint: string
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE"
  isExternalApi?: boolean
  setToken?: boolean
  body?: T
  customConfig?: RequestInit
}

export default function client<PayloadType, ResponseType>({
  endpoint,
  method,
  body,
  setToken = true,
  customConfig = {},
  isExternalApi = false,
}: IClientApiParams<PayloadType>) {
  const controller = new AbortController()
  const baseUrl = isExternalApi ? process.env["EXTERNAL_BASE_URL"] : ""

  const headers: RequestInit["headers"] = { "content-type": "application/json" }
  if (setToken) headers.authorization = `Bearer ${process.env["EXTERNAL_API_TOKEN"]}`

  const config = {
    method,
    signal: controller.signal,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body && config.method !== "GET") config.body = JSON.stringify(body)

  const promise: Promise<ResponseType> = window.fetch(`${baseUrl}${endpoint}`, config).then(async (response) => {
    if (response.status === 401) return // todo redirect to login
    if (response.status === 202) return Promise.resolve()

    const data = await response.json()
    if (response.ok) return data
    else return Promise.reject(data)
  })

  // promise.cancel = () => controller.abort() // todo fixme
  return promise
}
