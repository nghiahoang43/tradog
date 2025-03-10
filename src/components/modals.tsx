"use client";

import CreateBotModal from "@/app/features/bot/components/createBotModal";
import { useEffect, useState } from "react";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateBotModal />
    </>
  );
};
