import { NextResponse } from "next/server"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a temporary blob for PDFLoader
    const blob = new Blob([buffer], { type: "application/pdf" })

    // Load and process the PDF
    const loader = new PDFLoader(blob)
    const docs = await loader.load()
    
    // Extract text content from PDF
    const pdfContent = docs.map(doc => doc.pageContent).join(" ")

    return NextResponse.json({ content: pdfContent })
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json(
      { error: "Failed to process PDF" }, 
      { status: 500 }
    )
  }
}