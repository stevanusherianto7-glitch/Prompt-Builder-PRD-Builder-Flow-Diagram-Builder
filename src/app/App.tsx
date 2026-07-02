import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { GodModeBuilder } from "./components/GodModeBuilder";
import { Dashboard } from "./components/Dashboard";
import { Playground } from "./components/Playground";

export type AppView = "builder" | "dashboard" | "playground";

export default function App() {
  const [view, setView] = useState<AppView>("builder");

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      <Sidebar activeView={view} onViewChange={setView} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activeView={view} onViewChange={setView} />
        <main className="flex-1 relative overflow-hidden bg-background">
          {view === "builder" && <GodModeBuilder />}
          {view === "dashboard" && <Dashboard />}
          {view === "playground" && <Playground />}
        </main>
      </div>
    </div>
  );
}
