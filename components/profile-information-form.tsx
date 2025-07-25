"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const profileFormSchema = z.object({
  name: z.string(),
  email: z.string(),
  username: z.string(),
})

interface ProfileFormValues {
  name: string
  email: string
  username: string
}

export function ProfileInformationForm() {
  const { currentUser, updateProfile } = useAuth()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : "",
      email: currentUser?.email || "",
      username: currentUser?.username || "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    if (currentUser) {
      try {
        const [firstName, ...lastNameParts] = data.name.split(' ')
        const lastName = lastNameParts.join(' ') || ''
        
        await updateProfile({
          firstName,
          lastName,
          username: data.username,
          email: data.email,
        })
        alert("Profile updated successfully!")
      } catch (error) {
        alert("Failed to update profile.")
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
