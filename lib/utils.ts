import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { QueryParams } from "@/hooks/useApi"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function urlQueryParamsBuilder(url: string, params: QueryParams | null, urlHasQueryParams: boolean) {
  if (!params) return url

  let urlParams = ""
  Object.keys(params).forEach((key) => (urlParams += `${key}=${params[key].toString().replace(/\s/g, "+")}&`))
  urlParams = urlParams.slice(0, -1) // to remove last & in urlParams

  return urlHasQueryParams ? url + "&" + urlParams : url + "?" + urlParams
}
