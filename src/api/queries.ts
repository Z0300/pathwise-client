import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../types/flow";
import type { SearchablePageRequest } from "../types/flow";

export const useFlows = (params: SearchablePageRequest = {}) =>
  useQuery({
    queryKey: ["flows", params],
    queryFn: () => api.getFlows(params),
  });

export const useFlow = (id: number) =>
  useQuery({
    queryKey: ["flows", id],
    queryFn: () => api.getFlow(id),
    enabled: !!id,
  });

export const useCreateFlow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createFlow,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flows"] }),
  });
};

export const useFlowNodes = (flowId: number) =>
  useQuery({
    queryKey: ["flows", flowId, "nodes"],
    queryFn: () => api.getFlowNodes(flowId),
    enabled: !!flowId,
  });

export const useCreateFlowNode = (flowId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createFlowNode,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["flows", flowId, "nodes"] }),
  });
};

export const useFlowEdges = (flowId: number) =>
  useQuery({
    queryKey: ["flows", flowId, "edges"],
    queryFn: () => api.getFlowEdges(flowId),
    enabled: !!flowId,
  });

export const useCreateFlowEdge = (flowId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createFlowEdge,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["flows", flowId, "edges"] }),
  });
};

export const useEnumeratePaths = (flowId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.enumeratePaths(flowId),
    onSuccess: (data) => qc.setQueryData(["flows", flowId, "paths"], data),
  });
};
