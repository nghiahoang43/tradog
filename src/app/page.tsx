"use client";

import { useGetBots } from "./features/bot/api/useGetBots";
import { useEffect, useMemo } from "react";
import { useCreateBotModal } from "./features/bot/store/useCreateBotModal";
import { useRouter } from "next/navigation";
import { LoaderPage } from "@/components/loaderPage";

export default function Home() {
  const router = useRouter();

  const [open, setOpen] = useCreateBotModal();
  const { data, isLoading } = useGetBots();

  const botId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (botId) {
      router.replace(`/bot/${botId}`);
    } else if (!open) {
      setOpen(true);
    } else {
      console.log("Open creation modal");
    }
  }, [botId, isLoading, open, setOpen, router]);

  return <LoaderPage />;
}
