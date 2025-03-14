"use client";

import { useState } from "react";
import { SignInFlow } from "../types";
import { SignUpCard } from "./SignUpCard";
import { SignInCard } from "./SignInCard";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  return (
    <div className="h-full flex items-center justify-center bg-[#fcd72b]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
