"use client";
import { CartProvider } from "./CartContext";
import { AuthProvider } from "./AuthProvider";
import { CartSyncHandler } from "./CartSyncHandler";
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "sonner";
import React from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="sog-theme"
    >
      <AuthProvider>
        <CartProvider>
          <CartSyncHandler />
          {children}
          <Toaster 
            position="top-center" 
            richColors 
            theme="system"
          />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
