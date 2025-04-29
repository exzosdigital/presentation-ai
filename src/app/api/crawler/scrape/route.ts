import { NextRequest, NextResponse } from "next/server";
import { Website } from "@spider-rs/spider-rs";

export async function POST(req: NextRequest) {
  try {
    const { url, selectors, useHeadless = false } = await req.json();

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

    // Scrape the website
    await website.scrape();

    // Get the pages
    const pages = website.getPages();

    // If selectors are provided, extract specific content
    let extractedData: any = {};
    
    if (selectors && pages.length > 0) {
      const page = pages[0]; // Get the first page
      
      // Process each selector
      for (const [key, selector] of Object.entries(selectors)) {
        try {
          // Use regex to extract content based on selector
          const regex = new RegExp(selector as string, 'g');
          const matches = [...(page.content || '').matchAll(regex)];
          
          extractedData[key] = matches.map(match => match[1] || match[0]);
        } catch (error) {
          extractedData[key] = `Error extracting: ${(error as Error).message}`;
        }
      }
    }

    // Return the scraped data
    return NextResponse.json({
      success: true,
      url,
      pages: pages.map(page => ({
        url: page.url,
        statusCode: page.statusCode,
        contentType: page.contentType,
        headers: page.headers,
      })),
      extractedData,
    });
  } catch (error) {
    console.error("Scraper error:", error);
    return NextResponse.json(
      { error: "Failed to scrape website", details: (error as Error).message },
      { status: 500 }
    );
  }
}

