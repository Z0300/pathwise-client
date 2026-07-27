import { apiClient } from "../api/client";

export interface Flow {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface FlowNode {
  id: number;
  flowId: number;
  nodeKey: string;
  nodeType: "start" | "end" | "action" | "decision";
  label: string;
}

export type NodeType = "start" | "end" | "action" | "decision";

export interface FlowEdge {
  id: number;
  flowId: number;
  fromNodeId: number;
  toNodeId: number;
  conditionLabel: string | null;
}

export interface PathStep {
  nodeId: number;
  nodeKey: string;
  conditionTaken: string | null;
}

export interface EnumeratedPath {
  id: number;
  flowId: number;
  pathSequence: PathStep[];
  createdAt: string;
}

export interface PageResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  meta?: MetaResponse;
}

interface MetaResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SearchablePageRequest {
  page?: number;
  size?: number;
  searchTerm?: string;
}

// Flows
export const getFlows = (request: SearchablePageRequest) =>
  apiClient
    .get<PageResponse<Flow[]>>("/flows", { params: request })
    .then((r) => r.data);
export const getFlow = (id: number) =>
  apiClient.get<{ data: Flow }>(`/flows/${id}`).then((r) => r.data.data);
export const createFlow = (payload: { name: string; description: string }) =>
  apiClient.post<{ data: Flow }>("/flows", payload).then((r) => r.data.data);

// Nodes
export const getFlowNodes = (flowId: number) =>
  apiClient
    .get<{ data: FlowNode[] }>(`/flows/${flowId}/nodes`)
    .then((r) => r.data.data);
export const createFlowNode = (payload: Omit<FlowNode, "id">) =>
  apiClient
    .post<{ data: FlowNode }>("/flow-nodes", payload)
    .then((r) => r.data.data);

// Edges
export const getFlowEdges = (flowId: number) =>
  apiClient
    .get<{ data: FlowEdge[] }>(`/flow-edges/flow/${flowId}`)
    .then((r) => r.data.data);
export const createFlowEdge = (payload: Omit<FlowEdge, "id">) =>
  apiClient
    .post<{ data: FlowEdge }>("/flow-edges", payload)
    .then((r) => r.data.data);

// Enumerate
export const enumeratePaths = (flowId: number) =>
  apiClient
    .post<{ data: EnumeratedPath[] }>(`/flows/${flowId}/enumerate`)
    .then((r) => r.data.data);
