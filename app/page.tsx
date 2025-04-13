import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  BookOpen,
  Youtube,
  FileQuestion,
  MessageSquare,
  Cpu,
  Zap,
  CircuitBoardIcon as Circuit,
  MicroscopeIcon as Microchip,
} from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to ElectroQuiz</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your comprehensive learning platform for Electronics Engineering (BE) students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          title="Study Resources"
          description="Access online documentation and downloadable PDF resources for electronics engineering."
          icon={<BookOpen className="h-8 w-8" />}
          href="/resources"
        />
        <FeatureCard
          title="Video Tutorials"
          description="Find relevant YouTube videos on electronics engineering topics."
          icon={<Youtube className="h-8 w-8" />}
          href="/videos"
        />
        <FeatureCard
          title="Practice Quizzes"
          description="Test your knowledge with quizzes on various electronics topics."
          icon={<FileQuestion className="h-8 w-8" />}
          href="/quizzes"
        />
        <FeatureCard
          title="AI Assistant"
          description="Get help from our AI assistant with electronics concepts and questions."
          icon={<MessageSquare className="h-8 w-8" />}
          href="/chat"
        />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Electronics Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopicCard
            title="Circuit Theory"
            description="Learn about Ohm's law, Kirchhoff's laws, and circuit analysis techniques."
            icon={<Circuit className="h-6 w-6" />}
            href="/resources?topic=circuit-theory"
          />
          <TopicCard
            title="Digital Electronics"
            description="Explore logic gates, flip-flops, and digital circuit design."
            icon={<Microchip className="h-6 w-6" />}
            href="/resources?topic=digital-electronics"
          />
          <TopicCard
            title="Analog Electronics"
            description="Study amplifiers, oscillators, and analog circuit design principles."
            icon={<Zap className="h-6 w-6" />}
            href="/resources?topic=analog-electronics"
          />
          <TopicCard
            title="Microprocessors"
            description="Understand microprocessor architecture, programming, and interfacing."
            icon={<Cpu className="h-6 w-6" />}
            href="/resources?topic=microprocessors"
          />
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to enhance your electronics knowledge?</h2>
        <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600">
          <Link href="/quizzes">Start a Quiz</Link>
        </Button>
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

function FeatureCard({ title, description, icon, href }: FeatureCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="mb-4 text-amber-500">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow"></CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href={href}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface TopicCardProps {
  title: string
  description: string
  icon: React.ReactNode
  href: string
}

function TopicCard({ title, description, icon, href }: TopicCardProps) {
  return (
    <Card className="h-full flex flex-col hover:border-amber-500 transition-colors">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="text-amber-500">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full">
          <Link href={href}>Learn More</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
