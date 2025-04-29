import { NextRequest, NextResponse } from "next/server";
import { Website } from "@spider-rs/spider-rs";
import { createHash } from "crypto";

// In-memory storage for page hashes (in a production app, use a database)
const pageHashes: Record<string, string> = {};

export async function POST(req: NextRequest) {
  try {
    const { url, cronExpression, useHeadless = false } = await req.json();

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

    // Add cron job if expression is provided
    if (cronExpression) {
      website = website.withCron(cronExpression);
    }

    // Build the website
    website.build();

    // Check for changes
    let hasChanged = false;
    let currentHash = "";
    let previousHash = pageHashes[url];

    // Define page event handler
    const onPageEvent = (_err: any, page: any) => {
      // Create a hash of the page content
      const content = page.content || "";
      currentHash = createHash("md5").update(content).digest("hex");
      
      // Check if the page has changed
      if (previousHash && currentHash !== previousHash) {
        hasChanged = true;
      }
      
      // Update the stored hash
      pageHashes[url] = currentHash;
    };

    // Start crawling
    if (cronExpression) {
      // For demonstration, we'll just run once and not actually start the cron job
      // In a real implementation, you would store the cron handle and manage it
      await website.crawl(onPageEvent, false, useHeadless);
    } else {
      await website.crawl(onPageEvent, false, useHeadless);
    }

    // Return the monitoring result
    return NextResponse.json({
      success: true,
      url,
      isFirstCheck: !previousHash,
      hasChanged,
      currentHash,
      previousHash: previousHash || null,
    });
  } catch (error) {
    console.error("Monitoring error:", error);
    return NextResponse.json(
      { error: "Failed to monitor website", details: (error as Error).message },
      { status: 500 }
    );
  }
}

