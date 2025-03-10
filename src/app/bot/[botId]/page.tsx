"use client";
import { LoaderPage } from "@/components/loaderPage";
import { useBotId } from "@/hooks/useBotId";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BotPage = () => {
  const router = useRouter();
  const botId = useBotId();

  useEffect(() => {
    router.replace(`/bot/${botId}/dashboard`);
  }, [router, botId]);
  return (
    <div className="h-screen">
      <LoaderPage />
    </div>
  );
};

export default BotPage;
