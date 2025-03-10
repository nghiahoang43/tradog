import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export const useGetBots = () => {
  const data = useQuery(api.bots.get);

  const isLoading = data === undefined;
  return { data, isLoading };
};
