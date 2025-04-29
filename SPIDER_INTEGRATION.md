# Spider Web Crawler Integration

This document describes the integration of the [spider-rs/spider](https://github.com/spider-rs/spider) web crawler into the Presentation AI application.

## Overview

The Spider web crawler is a high-performance web crawler and scraper written in Rust, with bindings for Node.js. This integration adds powerful web crawling, scraping, and content extraction capabilities to the Presentation AI application.

## Features

The integration includes the following features:

1. **Web Crawling**: Crawl websites and collect all links and pages.
2. **Content Scraping**: Extract specific content from websites using selectors.
3. **Headless Rendering**: Render JavaScript-heavy websites using headless Chrome.
4. **Text Extraction**: Extract plain text from websites.
5. **Website Monitoring**: Monitor websites for changes.

## API Endpoints

The following API endpoints have been added:

- `POST /api/crawler`: Crawl a website and collect links and pages.
- `POST /api/crawler/scrape`: Extract specific content from a website using selectors.
- `POST /api/crawler/render`: Render a website with JavaScript using headless Chrome.
- `POST /api/crawler/extract-text`: Extract plain text from a website.
- `POST /api/crawler/monitor`: Monitor a website for changes.

## User Interface

A new user interface has been added to interact with the web crawler:

- **Web Crawler UI**: Access the web crawler UI at `/presentation/crawler`.
- **Tools Menu**: Access the web crawler from the "Tools" dropdown in the presentation header.

## Usage Examples

### Crawling a Website

```javascript
// Example API request
const response = await fetch("/api/crawler", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    maxPages: 20,
    blacklistUrls: ["/admin", "/login"],
  }),
});

const data = await response.json();
console.log(data.pages); // Array of crawled pages
console.log(data.links); // Array of links found
```

### Scraping Content

```javascript
// Example API request
const response = await fetch("/api/crawler/scrape", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    selectors: {
      title: "<title>(.*?)</title>",
      headings: "<h1>(.*?)</h1>",
    },
    useHeadless: false,
  }),
});

const data = await response.json();
console.log(data.extractedData); // Extracted content
```

### Rendering JavaScript Pages

```javascript
// Example API request
const response = await fetch("/api/crawler/render", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    waitTime: 5000, // Wait 5 seconds for JavaScript to execute
  }),
});

const data = await response.json();
console.log(data.page.content); // Rendered HTML content
```

### Extracting Text

```javascript
// Example API request
const response = await fetch("/api/crawler/extract-text", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    useHeadless: true, // Use headless Chrome for JavaScript rendering
  }),
});

const data = await response.json();
console.log(data.text); // Extracted text
```

### Monitoring for Changes

```javascript
// Example API request
const response = await fetch("/api/crawler/monitor", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
    cronExpression: "*/30 * * * *", // Check every 30 minutes
    useHeadless: false,
  }),
});

const data = await response.json();
console.log(data.hasChanged); // Whether the page has changed
```

## Dependencies

This integration relies on the following dependencies:

- `@spider-rs/spider-rs`: The Node.js bindings for the Spider web crawler.

## Future Enhancements

Potential future enhancements include:

1. **Content Transformation**: Add support for transforming HTML to markdown, JSON, or other formats.
2. **Data Storage**: Add support for storing crawled data in a database.
3. **Scheduled Crawling**: Add support for scheduling crawls using cron expressions.
4. **Proxy Support**: Add support for using HTTP proxies for crawling.
5. **Authentication**: Add support for crawling authenticated websites.
6. **Rate Limiting**: Add support for rate limiting to avoid overloading websites.
7. **Custom Selectors**: Add support for custom CSS and XPath selectors.
8. **AI Integration**: Add support for using AI to extract specific content from websites.

## References

- [Spider Web Crawler](https://github.com/spider-rs/spider)
- [Spider Node.js Bindings](https://github.com/spider-rs/spider-nodejs)
- [Spider Documentation](https://docs.rs/spider)

