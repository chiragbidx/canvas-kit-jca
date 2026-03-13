import Link from "next/link";
import { Activity, Home, Settings } from "lucide-react";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/dashboard/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAuthSessionEmail } from "@/lib/auth/session";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home, active: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, active: false },
];

const recentActivity = [
  { title: "New user signup", detail: "sarah@acme.dev created an account", time: "2m ago" },
  { title: "Plan upgraded", detail: "starter@pulsehq.com moved to Pro plan", time: "28m ago" },
  { title: "Invoice paid", detail: "INV-2487 was paid successfully", time: "1h ago" },
  { title: "Team invited", detail: "3 users invited to FinchFlow workspace", time: "3h ago" },
];

export default async function DashboardPage() {
  const email = await getAuthSessionEmail();
  if (!email) {
    redirect("/auth#signin");
  }

  const accountName = email.split("@")[0] ?? "User";
  const initials = accountName
    .split(/[.\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="grid min-h-screen w-full md:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden border-r bg-card p-6 md:block">
          <div className="mb-8 flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
              P
            </div>
            <p className="font-semibold">Panda Admin</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="w-full p-4 sm:p-6 md:p-8 lg:p-10">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
            </div>

            <div className="flex items-center gap-2">
              <Input placeholder="Search..." className="w-[180px] bg-card sm:w-[220px]" />
              <form action={signOutAction}>
                <Button variant="outline" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          </header>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-2xl">$48,290</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">+12.4% this month</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Subscriptions</CardDescription>
                <CardTitle className="text-2xl">1,284</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">+6.1% this month</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>New Signups</CardDescription>
                <CardTitle className="text-2xl">342</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">+18.2% this month</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Churn Rate</CardDescription>
                <CardTitle className="text-2xl">1.8%</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">-0.3% this month</Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 2xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Weekly engagement snapshot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid h-[280px] place-items-center rounded-lg border border-dashed text-center">
                  <div className="space-y-2">
                    <Activity className="mx-auto size-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Chart area placeholder based on shadcn dashboard example.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Signed in user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <Avatar>
                    <AvatarFallback>{initials || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">{accountName}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href="/">Back to landing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest account events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={`${item.title}-${item.time}`}
                  className="flex items-start justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
