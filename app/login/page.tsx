"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { useAuth } from "@/contexts/auth-context"
// Zod removed – we’ll do plain HTML/React-Hook-Form validation

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  // ─── RHF & Zod setup ────────────────────────────────────────────────────────
  type LoginFormValues = { email: string; password: string }
  const form = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  })

  // ─── Submit handler ─────────────────────────────────────────────────────────
  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data) // authenticates via the mock service in lib/auth
      toast.success("Login successful! Redirecting …")
      router.push("/account-settings") // go straight to account settings
    } catch (error: any) {
      toast.error("Login failed", {
        description: error?.message ?? "Please check your credentials and try again.",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Log in to continue to Trashure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} required />
                    </FormControl>
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} required minLength={1} />
                    </FormControl>
                    {form.formState.errors.password && (
                      <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
                    )}
                  </FormItem>
                )}
              />
              <Button type="submit" variant="invert-accent" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Logging In…" : "Log In"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
