"use client";

import { useState } from "react";
import { AuthForm } from "./(auth)/_components/auth-form";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      غخ
    </div>
  );
}