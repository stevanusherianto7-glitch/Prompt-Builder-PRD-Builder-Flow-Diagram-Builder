import React from "react";
import { LineChart, Line, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUpRight, Zap, Target, Shield, TrendingUp } from "lucide-react";

const requestData = [
  { name: "Jan", req: 100 }, { name: "Feb", req: 120 }, { name: "Mar", req: 170 },
  { name: "Apr", req: 220 }, { name: "May", req: 380 }, { name: "Jun", req: 590 },
  { name: "Jul", req: 850 }, { name: "Aug", req: 1200 },
];

const scoreData = [
  { day: "Mon", score: 7200 }, { day: "Tue", score: 7850 }, { day: "Wed", score: 8100 },
  { day: "Thu", score: 8600 }, { day: "Fri", score: 9100 }, { day: "Sat", score: 9350 },
  { day: "Sun", score: 9480 },
];

const tooltipStyle = { backgroundColor: "var(--popover)", borderColor: "var(--border)", borderRadius: "8px", fontSize: "11px" };

export function Dashboard() {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">PromptOps Dashboard</h1>
          <p className="text-sm text-muted-foreground">God Mode Level 9500 · Google Gemini 2.5 Flash / Pro</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Requests", value: "1.2M", change: "+24.5%", icon: TrendingUp, color: "text-primary" },
            { label: "Avg God Score", value: "9,480", change: "+12.3%", icon: Target, color: "text-accent" },
            { label: "Success Rate", value: "99.7%", change: "+0.2%", icon: Shield, color: "text-chart-3" },
            { label: "Avg Latency", value: "420ms", change: "-8.1%", icon: Zap, color: "text-chart-4" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-accent mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-5 pb-2">
              <p className="text-xs font-medium text-muted-foreground">Total Requests</p>
              <p className="text-3xl font-bold mt-1">1.2M</p>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}k`, "Requests"]} labelStyle={{ display: "none" }} />
                  <Area type="monotone" dataKey="req" stroke="var(--primary)" strokeWidth={2} fill="url(#reqGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-5 pb-2">
              <p className="text-xs font-medium text-muted-foreground">Avg God Mode Score</p>
              <p className="text-3xl font-bold mt-1">9,480<span className="text-lg text-muted-foreground font-normal">/10000</span></p>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [v.toLocaleString(), "Score"]} labelStyle={{ display: "none" }} />
                  <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "var(--accent)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent prompts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Recent God Mode Outputs</h2>
            <button className="text-xs text-primary hover:underline">View all →</button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { title: "SaaS Dashboard System Prompt", score: 9480, mode: "Prompt", time: "5 mins ago", tokens: "2,341" },
              { title: "E-commerce PRD — Mobile Checkout", score: 9320, mode: "PRD", time: "2 hours ago", tokens: "3,892" },
              { title: "AI Chat Widget Flow Diagram", score: 9100, mode: "Diagram", time: "1 day ago", tokens: "847" },
              { title: "Analytics API Integration Prompt", score: 9250, mode: "Prompt", time: "3 days ago", tokens: "1,923" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Updated {item.time} · {item.tokens} tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 mr-2">
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">Mode</p>
                    <p className="text-xs font-medium">{item.mode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground">God Score</p>
                    <p className="text-xs font-bold text-primary">{item.score.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
