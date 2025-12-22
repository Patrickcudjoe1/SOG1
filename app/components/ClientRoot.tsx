"use client";
import { CartProvider } from "./CartContext";
import React from "react";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>{children}</CartProvider>
  );
}
