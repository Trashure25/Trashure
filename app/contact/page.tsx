"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Instagram, Video } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600">Get in touch with the Trashure team</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {/* Email Contact */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Email Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              For general inquiries, support, and business opportunities
            </p>
            <Button asChild className="w-full">
              <a href="mailto:trashure25@gmail.com">
                trashure25@gmail.com
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Instagram */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
            <CardTitle className="text-xl">Instagram</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Follow us for updates, style inspiration, and community highlights
            </p>
            <Button asChild className="w-full" variant="outline">
              <a href="https://instagram.com/trashure" target="_blank" rel="noopener noreferrer">
                @trashure
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* TikTok */}
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-xl">TikTok</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Coming soon! Follow us for behind-the-scenes content and style tips
            </p>
            <Button disabled className="w-full" variant="outline">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Email Support</h4>
                <p className="text-gray-600">We typically respond within 24-48 hours</p>
              </div>
              <div>
                <h4 className="font-semibold">Instagram</h4>
                <p className="text-gray-600">We check DMs daily and respond within 24 hours</p>
              </div>
              <div>
                <h4 className="font-semibold">Urgent Issues</h4>
                <p className="text-gray-600">For urgent matters, please email us directly</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Can Help With</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Account and technical support</li>
              <li>• Trading and transaction issues</li>
              <li>• Credit and payment questions</li>
              <li>• Reporting users or items</li>
              <li>• Business partnerships</li>
              <li>• Feature requests and feedback</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Link */}
      <div className="mt-12 text-center">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">Looking for quick answers?</h3>
            <p className="text-gray-600 mb-4">
              Check out our FAQ page for answers to common questions.
            </p>
            <Button asChild variant="outline">
              <a href="/faq">View FAQ</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 