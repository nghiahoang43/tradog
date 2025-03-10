"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateBotModal } from "../store/useCreateBotModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateBot } from "../api/useCreateBot";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateBotModal = () => {
  const router = useRouter();
  const [open, setOpen] = useCreateBotModal();
  const [name, setName] = useState<string>("");
  const [budget, setBudget] = useState<number>(100);

  const { mutate, isPending } = useCreateBot();

  const handleClose = () => {
    setOpen(false);
    setName("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, budget: 100 },
      {
        onSuccess(id) {
          toast.success("Bot created");
          router.push(`/bot/${id}`);
          handleClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a bot</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Bot name e.g. 'CryptoBot', 'StockBot'"
          />
          <Input
            type="number"
            value={budget}
            onChange={(e) => {
              setBudget(Number(e.target.value));
            }}
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button disabled={false}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBotModal;
