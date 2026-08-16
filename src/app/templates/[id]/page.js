import React from "react";
import TemplateClient from "./TemplateClient";

// Tell Next.js which paths to pre-compile during static export
export async function generateStaticParams() {
  return [
    { id: "classic" },
    { id: "modern-tech" },
    { id: "executive" },
    { id: "compact" },
    { id: "creative" }
  ];
}

export default async function Page({ params }) {
  const { id } = await params;
  return <TemplateClient id={id} />;
}
