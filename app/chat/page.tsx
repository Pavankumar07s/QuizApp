"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Zap, BookOpen, FileQuestion } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content:
        "Hello! I'm your Electronics Engineering AI assistant powered by Groq. I can help you with questions about circuit theory, digital electronics, analog electronics, microprocessors, and other electronics topics. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("chat")

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call the Groq API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response from Groq API")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.content,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Electronics Engineering AI Assistant</h1>

        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="topics">Suggested Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-amber-500" />
                      Electronics AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className={message.role === "user" ? "bg-primary" : "bg-amber-500"}>
                                  {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`rounded-lg p-3 ${
                                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="flex gap-3 max-w-[80%]">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-amber-500">
                                  <Bot className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="rounded-lg p-3 bg-muted">
                                <div className="flex space-x-2">
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce"></div>
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-75"></div>
                                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-bounce delay-150"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                      <Input
                        placeholder="Ask about electronics engineering concepts..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading}
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </div>

              <div className="hidden lg:block">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-amber-500" />
                      Learning Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Study Materials</h3>
                          <div className="space-y-2">
                            <Button asChild variant="outline" size="sm" className="w-full justify-start">
                              <Link href="/resources">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Browse Study Resources
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm" className="w-full justify-start">
                              <Link href="/videos">
                                <Zap className="h-4 w-4 mr-2" />
                                Video Tutorials
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Practice Quizzes</h3>
                          <div className="space-y-2">
                            <Button asChild variant="outline" size="sm" className="w-full justify-start">
                              <Link href="/quizzes">
                                <FileQuestion className="h-4 w-4 mr-2" />
                                Take a Quiz
                              </Link>
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Popular Topics</h3>
                          <div className="flex flex-wrap gap-2">
                            {popularTopics.map((topic, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer bg-amber-50 hover:bg-amber-100 text-amber-800"
                                onClick={() => {
                                  setInput(`Tell me about ${topic}`)
                                  setActiveTab("chat")
                                }}
                              >
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Topics for Electronics Engineering</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topicCategories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-medium text-lg">{category.name}</h3>
                      <div className="space-y-2">
                        {category.topics.map((topic, topicIndex) => (
                          <Button
                            key={topicIndex}
                            variant="outline"
                            className="w-full justify-start text-left"
                            onClick={() => {
                              setInput(`Tell me about ${topic}`)
                              setActiveTab("chat")
                            }}
                          >
                            {topic}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const popularTopics = [
  "Ohm's Law",
  "Logic Gates",
  "Operational Amplifiers",
  "Microcontrollers",
  "Transistors",
  "Filters",
  "Digital Signal Processing",
  "PCB Design",
]

const topicCategories = [
  {
    name: "Circuit Theory",
    topics: [
      "Ohm's Law and Kirchhoff's Laws",
      "Thevenin and Norton Theorems",
      "RC and RL Circuits",
      "Resonance in RLC Circuits",
      "Network Analysis Techniques",
    ],
  },
  {
    name: "Digital Electronics",
    topics: [
      "Boolean Algebra and Logic Gates",
      "Combinational Circuit Design",
      "Sequential Circuits and Flip-Flops",
      "Counters and Registers",
      "Digital-to-Analog Conversion",
    ],
  },
  {
    name: "Analog Electronics",
    topics: [
      "Semiconductor Devices",
      "Transistor Biasing Techniques",
      "Operational Amplifier Applications",
      "Filter Design",
      "Oscillator Circuits",
    ],
  },
  {
    name: "Microprocessors",
    topics: [
      "Microprocessor Architecture",
      "Assembly Language Programming",
      "Memory Interfacing",
      "I/O Interfacing",
      "Microcontroller Applications",
    ],
  },
  {
    name: "Communication Systems",
    topics: [
      "Modulation Techniques",
      "Digital Communication",
      "Transmission Lines",
      "Antenna Theory",
      "Wireless Communication",
    ],
  },
  {
    name: "Power Electronics",
    topics: ["Power Semiconductor Devices", "AC-DC Converters", "DC-DC Converters", "Inverters", "Motor Drives"],
  },
]
