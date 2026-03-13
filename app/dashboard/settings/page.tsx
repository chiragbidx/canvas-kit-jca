import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/dashboard/actions";
import { updateEmailAction, updatePasswordAction } from "@/app/dashboard/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthSessionEmail } from "@/lib/auth/session";

type SettingsPageProps = {
  searchParams?: Promise<{
    status?: string;
    message?: string;
  }>;
};

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home, active: false },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, active: true },
];

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const email = await getAuthSessionEmail();
  if (!email) {
    redirect("/auth#signin");
  }

  const params = (await searchParams) ?? {};
  const status = params.status === "success" || params.status === "error" ? params.status : null;
  const message = typeof params.message === "string" ? params.message : null;

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
              <p className="text-sm text-muted-foreground">Account settings</p>
              <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>

            <form action={signOutAction}>
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          </header>

          {status && message ? (
            <p
              className={`mb-6 rounded-md border px-3 py-2 text-sm ${
                status === "success"
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {message}
            </p>
          ) : null}

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Change Email</CardTitle>
                <CardDescription>Update your login email address.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateEmailAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newEmail">New email</Label>
                    <Input id="newEmail" name="newEmail" type="email" defaultValue={email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailCurrentPassword">Current password</Label>
                    <Input
                      id="emailCurrentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <Button type="submit">Update email</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Set a new password for your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updatePasswordAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordCurrentPassword">Current password</Label>
                    <Input
                      id="passwordCurrentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Minimum 8 characters"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm new password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                  <Button type="submit">Update password</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
