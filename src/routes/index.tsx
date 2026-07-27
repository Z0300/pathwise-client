import { createFileRoute } from "@tanstack/react-router";
import FlowList from "../components/flows/FlowList";

export const Route = createFileRoute("/")({
  component: FlowList,
});
