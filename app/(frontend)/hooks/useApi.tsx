import {
  REACT_QUERY_RETRY,
  REACT_QUERY_STALE_TIME,
  REFECH_ON_WINDOW_FOCUS
} from 'config/global.config';
import { UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';

import client, { IClientApiParams } from 'lib/api-client';
import { urlQueryParamsBuilder } from 'lib/utils';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle } from 'lucide-react';

export type QueryParams = { [key: string]: number | string };
export type RequestData<T> = {
  url: string;
  method: IClientApiParams<any>['method'];
  urlHasQueryParams?: boolean;
  queryParams?: QueryParams;
  body?: T;
  isExternalApi?: boolean;
  setToken?: boolean;
};

const queryFn = <ApiPayload, ApiResponse>(
  requestData: RequestData<ApiPayload>
) => {
  const { url, method } = requestData;
  const urlHasQueryParams = requestData?.urlHasQueryParams || false;
  const queryParams = requestData?.queryParams || null;
  const body = requestData?.body;

  const args: IClientApiParams<ApiPayload> = {
    endpoint: urlQueryParamsBuilder(url, queryParams, urlHasQueryParams),
    method,
    body
  };

  if (requestData?.isExternalApi !== undefined)
    args.isExternalApi = requestData?.isExternalApi;
  if (requestData?.setToken !== undefined)
    args.setToken = requestData?.setToken;

  return client<ApiPayload, ApiResponse>(args);
};

export function useGenericQuery<ApiPayload, ApiResponse>({
  requestData,
  queryKey,
  queryOptions = {}
}: {
  requestData: RequestData<ApiPayload>;
  queryKey: string;
  queryOptions?: Omit<
    UseQueryOptions<ApiResponse, unknown>,
    'queryKey' | 'queryFn'
  >;
}) {
  return useQuery({
    queryKey: [queryKey, { ...requestData?.queryParams }],
    queryFn: () => queryFn<ApiPayload, ApiResponse>(requestData),
    // suspense: true, // todo fixme
    retry: REACT_QUERY_RETRY,
    staleTime: REACT_QUERY_STALE_TIME,
    refetchOnWindowFocus: REFECH_ON_WINDOW_FOCUS
    // ...queryOptions, // todo fixme
  });
}

export function useGenericMutation<ApiPayload, ApiResponse>() {
  return useMutation({
    mutationFn: (requestData: RequestData<ApiPayload>) =>
      queryFn<ApiPayload, ApiResponse>(requestData),
    onError: (error) => {
      console.log('error', error);
      toast({
        variant: 'destructive',
        description: (
          <div className="flex font-bold items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Erreur, merci réessayez plus tard.
          </div>
        )
      });
    }
  });
}
