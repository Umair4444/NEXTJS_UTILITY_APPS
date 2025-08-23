"use client";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Linkedin, PenTool, BarChart3 } from "lucide-react";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  const { user, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Linkedin className="h-12 w-12 text-secondary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              LinkedIn Posting App
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create, schedule, and publish professional posts directly to
              LinkedIn. Streamline your social media presence with our powerful
              posting tool.
            </p>
            <Button
              onClick={login}
              size="lg"
              className="bg-secondary hover:bg-secondary/90"
            >
              <Linkedin className="mr-2 h-5 w-5" />
              Connect with LinkedIn
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card>
              <CardHeader>
                <div className="p-2 bg-secondary/10 rounded-lg w-fit">
                  <PenTool className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Easy Post Creation</CardTitle>
                <CardDescription>
                  Create professional posts with our intuitive editor and rich
                  formatting options.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 bg-secondary/10 rounded-lg w-fit">
                  <Linkedin className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Direct Publishing</CardTitle>
                <CardDescription>
                  Publish posts directly to your LinkedIn profile with one
                  click.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 bg-secondary/10 rounded-lg w-fit">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Post History</CardTitle>
                <CardDescription>
                  Track and manage all your published posts in one organized
                  dashboard.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}
