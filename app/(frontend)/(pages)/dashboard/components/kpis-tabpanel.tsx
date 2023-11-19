'use client';

import { useGenericQuery } from '@/hooks/useApi';
import { Card, Flex, Grid, Metric, MetricProps, Text } from '@tremor/react';
import { API_KPIS } from 'config/api-endpoints.config';
import { useMemo } from 'react';
import { TimelineChart } from './timeline-chart';
import { KpisPayloadType, MetricsCard } from 'types/types';
import { AreaChart } from 'lucide-react';

const kpisTitleMapper: Record<string, string> = {
  departmentCount: 'Total de departments',
  activitiesCount: "Total d'activités",
  totalTarget: 'Total cible',
  totalCreated: 'Total realisés'
};

const kpisColorMapper: Record<string, MetricProps['color']> = {
  departmentCount: 'blue',
  activitiesCount: 'pink',
  totalTarget: 'yellow',
  totalCreated: 'green'
};

export default function KpisTabpanel({
  metricsCount,
  activity_id,
  department_id
}: {
  metricsCount: 4 | 3 | 2;
  department_id?: string;
  activity_id?: string;
}) {
  const {
    isLoading,
    isError,
    data: payload
  } = useGenericQuery<{}, KpisPayloadType>({
    queryKey: 'QUERY_KPIS',
    requestData: {
      url: API_KPIS,
      method: 'POST',
      body: activity_id
        ? { activity_id }
        : department_id
        ? { department_id }
        : {}
    }
  });

  const kpisData = useMemo(() => {
    if (!isLoading && payload) {
      const kpis: MetricsCard[] = [];
      for (const [key, value] of Object.entries(payload.kpis)) {
        if (value || value == 0) {
          kpis.push({
            value,
            title: kpisTitleMapper[key],
            color: kpisColorMapper[key]
          });
        }
      }
      return kpis;
    }
    return [];
  }, [payload, isLoading]);

  // todo add skeleton and error page
  if (isLoading) return 'En cours de chargement ...';
  if (isError) return 'Error ...';

  return (
    <>
      <Grid numItemsMd={2} numItemsLg={metricsCount} className="mt-10 gap-6">
        {kpisData.map((item) => (
          <Card key={item.title}>
            <Flex alignItems="start">
              <div className="truncate">
                <Text className="text-xl" color={item.color}>
                  {item.title}
                </Text>
                <Metric className="truncate">{item.value}</Metric>
              </div>
            </Flex>
          </Card>
        ))}
      </Grid>
      {!!payload?.timeline?.length ? (
        <TimelineChart timeline={payload?.timeline || []} />
      ) : (
        <div className="mt-10 py-10 mb-6 flex gap-2 items-center text-lg justify-center w-full font-semibold text-blue-500">
          <AreaChart className="h-8 w-8" /> Aucune données a afficher !
        </div>
      )}
    </>
  );
}
