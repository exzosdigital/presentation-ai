import { NextRequest, NextResponse } from "next/server";
import { Website, pageTitle } from "@spider-rs/spider-rs";

export async function POST(req: NextRequest) {
  try {
    const { url, maxPages, blacklistUrls = [], headers = {} } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Create a new website crawler instance
    const website = new Website(url)
      .withHeaders(headers)
      .withBudget({
        "*": maxPages || 20, // Default to 20 pages max
      });

    // Add blacklist URLs if provided
    if (blacklistUrls.length > 0) {
      website.withBlacklistUrl(blacklistUrls);
    }

    // Build the website crawler
    website.build();

    // Store crawled pages
    const crawledPages: any[] = [];

    // Define page event handler
    const onPageEvent = (_err: any, page: any) => {
      const title = pageTitle(page);
      crawledPages.push({
        url: page.url,
        title,
        statusCode: page.statusCode,
        contentType: page.contentType,
        headers: page.headers,
      });
    };

    // Start crawling
    await website.crawl(onPageEvent);

    // Return the crawled data
    return NextResponse.json({
      success: true,
      pages: crawledPages,
      links: website.getLinks(),
    });
  } catch (error) {
    console.error("Crawler error:", error);
    return NextResponse.json(
      { error: "Failed to crawl website", details: (error as Error).message },
      { status: 500 }
    );
  }
}

