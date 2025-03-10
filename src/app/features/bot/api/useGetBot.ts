import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface UseGetBotProps {
  id: Id<"bots">;
}

export const useGetBot = ({ id }: UseGetBotProps) => {
  const data = useQuery(api.bots.getById, { id });

  const isLoading = data === undefined;
  return { data, isLoading };
};
