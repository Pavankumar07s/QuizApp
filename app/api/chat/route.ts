import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Prepare the system message for electronics engineering context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant specialized in Electronics Engineering for BE students. 
      Provide accurate, educational responses about circuit theory, digital electronics, analog electronics, 
      microprocessors, power electronics, communication systems, and other electronics topics. 
      When appropriate, suggest relevant study resources or quiz topics that would help the student 
      learn more about the subject. Keep explanations clear and concise, using technical terminology 
      appropriately for engineering students.`,
    }

    // Call the Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Groq API error:", errorData)
      throw new Error(`Groq API error: ${response.status}`)
    }

    const data = await response.json()
    const assistantResponse = data.choices[0].message.content

    return NextResponse.json({ content: assistantResponse })
  } catch (error) {
    console.error("Error in chat API route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
