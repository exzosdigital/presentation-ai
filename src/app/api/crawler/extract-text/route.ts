import { NextRequest, NextResponse } from "next/server";
import { Website } from "@spider-rs/spider-rs";

export async function POST(req: NextRequest) {
  try {
    const { url, useHeadless = false } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Create a new website instance
    let website = new Website(url);

    // Use headless Chrome if requested
    if (useHeadless) {
      website = website.withChromeIntercept(true, true);
    }

    // Build the website
    website.build();

    // Store extracted text
    let extractedText = "";

    // Define page event handler
    const onPageEvent = (_err: any, page: any) => {
      // Extract text from HTML content
      const htmlContent = page.content || "";
      
      // Simple text extraction (remove HTML tags and decode entities)
      extractedText = htmlContent
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove scripts
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "") // Remove styles
        .replace(/<[^>]*>/g, " ") // Remove HTML tags
        .replace(/&nbsp;/g, " ") // Replace non-breaking spaces
        .replace(/&amp;/g, "&") // Replace ampersands
        .replace(/&lt;/g, "<") // Replace less than
        .replace(/&gt;/g, ">") // Replace greater than
        .replace(/&quot;/g, "\"") // Replace quotes
        .replace(/&#39;/g, "'") // Replace apostrophes
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim(); // Trim whitespace
    };

    // Start crawling
    await website.crawl(onPageEvent, false, useHeadless);

    // Return the extracted text
    return NextResponse.json({
      success: true,
      url,
      text: extractedText,
    });
  } catch (error) {
    console.error("Text extraction error:", error);
    return NextResponse.json(
      { error: "Failed to extract text", details: (error as Error).message },
      { status: 500 }
    );
  }
}

