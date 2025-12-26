"use client";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthProvider";
import { CartSyncHandler } from "./CartSyncHandler";
import { Toaster } from "sonner";
import React from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CartSyncHandler />
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
