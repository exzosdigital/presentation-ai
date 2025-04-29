import { NextRequest, NextResponse } from "next/server";
import { Website } from "@spider-rs/spider-rs";

export async function POST(req: NextRequest) {
  try {
    const { url, waitTime = 5000 } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Create a new website with Chrome headless browser
    const website = new Website(url)
      .withChromeIntercept(true, true) // Enable Chrome intercept with JavaScript
      .withChromeWaitTime(waitTime) // Wait time in milliseconds for JavaScript to execute
      .build();

    // Store rendered page
    let renderedPage: any = null;

    // Define page event handler
    const onPageEvent = (_err: any, page: any) => {
      renderedPage = {
        url: page.url,
        content: page.content,
        statusCode: page.statusCode,
        contentType: page.contentType,
        headers: page.headers,
      };
    };

    // Start crawling with headless Chrome
    await website.crawl(onPageEvent, false, true);

    // Return the rendered page
    return NextResponse.json({
      success: true,
      page: renderedPage,
    });
  } catch (error) {
    console.error("Renderer error:", error);
    return NextResponse.json(
      { error: "Failed to render website", details: (error as Error).message },
      { status: 500 }
    );
  }
}

