import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lockersApi } from '../api/lockersApi';
import type {
  DoorCommandInput,
  UpdateLockerInput,
  UpdateStationInput,
} from '../schemas';
import type { LockerFilters } from '../types';

export const lockerKeys = {
  all: ['lockers'] as const,
  lists: () => [...lockerKeys.all, 'list'] as const,
  list: (filters: LockerFilters) => [...lockerKeys.lists(), filters] as const,
  detail: (id: string) => [...lockerKeys.all, 'detail', id] as const,
  events: (id: string) => [...lockerKeys.all, 'events', id] as const,
  stations: ['stations'] as const,
  station: (sn: string) => ['stations', sn] as const,
};

export function useStations() {
  return useQuery({
    queryKey: lockerKeys.stations,
    queryFn: () => lockersApi.listStations(),
  });
}

export function useStation(sn: string | undefined) {
  return useQuery({
    queryKey: sn ? lockerKeys.station(sn) : ['stations', 'none'],
    queryFn: () => lockersApi.getStation(sn as string),
    enabled: !!sn,
  });
}

export function useLockers(filters: LockerFilters = {}) {
  return useQuery({
    queryKey: lockerKeys.list(filters),
    queryFn: () => lockersApi.listLockers(filters),
  });
}

export function useLocker(id: string | undefined) {
  return useQuery({
    queryKey: id ? lockerKeys.detail(id) : ['lockers', 'none'],
    queryFn: () => lockersApi.getLocker(id as string),
    enabled: !!id,
  });
}

export function useUpdateLocker(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateLockerInput) => lockersApi.updateLocker(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(lockerKeys.detail(id), updated);
      qc.invalidateQueries({ queryKey: lockerKeys.lists() });
      qc.invalidateQueries({ queryKey: lockerKeys.stations });
    },
  });
}

export function useUpdateStation(sn: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStationInput) => lockersApi.updateStation(sn, input),
    onSuccess: (updated) => {
      qc.setQueryData(lockerKeys.station(sn), updated);
      qc.invalidateQueries({ queryKey: lockerKeys.stations });
    },
  });
}

export function useSyncStationFromTerminal(sn: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => lockersApi.syncStationFromTerminal(sn),
    onSuccess: () => {
      // Reconciliation may have changed door states across the whole station,
      // so refetch every list and the station detail.
      qc.invalidateQueries({ queryKey: lockerKeys.station(sn) });
      qc.invalidateQueries({ queryKey: lockerKeys.lists() });
      qc.invalidateQueries({ queryKey: lockerKeys.stations });
    },
  });
}

export function useDoorCommand(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DoorCommandInput) => lockersApi.sendDoorCommand(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lockerKeys.detail(id) });
      qc.invalidateQueries({ queryKey: lockerKeys.lists() });
      // Door commands write an audit row — refresh the activity timeline.
      qc.invalidateQueries({ queryKey: lockerKeys.events(id) });
    },
  });
}

export function useLockerEvents(id: string | undefined) {
  return useQuery({
    queryKey: id ? lockerKeys.events(id) : ['lockers', 'events', 'none'],
    queryFn: () => lockersApi.listLockerEvents(id as string),
    enabled: !!id,
  });
}
