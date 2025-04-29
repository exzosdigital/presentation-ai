"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function WebCrawler() {
  const [activeTab, setActiveTab] = useState("crawl");
  const [url, setUrl] = useState("");
  const [maxPages, setMaxPages] = useState(20);
  const [blacklistUrls, setBlacklistUrls] = useState("");
  const [useHeadless, setUseHeadless] = useState(false);
  const [selectors, setSelectors] = useState("");
  const [waitTime, setWaitTime] = useState(5000);
  const [cronExpression, setCronExpression] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCrawl = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/crawler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          maxPages,
          blacklistUrls: blacklistUrls.split("\n").filter(Boolean),
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      // Parse selectors from textarea (format: key=selector)
      const selectorsObj: Record<string, string> = {};
      selectors.split("\n").forEach(line => {
        const [key, value] = line.split("=").map(s => s.trim());
        if (key && value) {
          selectorsObj[key] = value;
        }
      });
      
      const response = await fetch("/api/crawler/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          selectors: selectorsObj,
          useHeadless,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleRender = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/crawler/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          waitTime,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleExtractText = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/crawler/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          useHeadless,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const handleMonitor = async () => {
    if (!url) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch("/api/crawler/monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          cronExpression: cronExpression || undefined,
          useHeadless,
        }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Web Crawler</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="crawl">Crawl</TabsTrigger>
          <TabsTrigger value="scrape">Scrape</TabsTrigger>
          <TabsTrigger value="render">Render</TabsTrigger>
          <TabsTrigger value="extract">Extract Text</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="crawl">
          <Card>
            <CardHeader>
              <CardTitle>Crawl Website</CardTitle>
              <CardDescription>
                Crawl a website and collect all links and pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="crawl-url">URL</Label>
                <Input
                  id="crawl-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-pages">Max Pages</Label>
                <Input
                  id="max-pages"
                  type="number"
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="blacklist">Blacklist URLs (one per line)</Label>
                <Textarea
                  id="blacklist"
                  placeholder="/admin\n/login"
                  value={blacklistUrls}
                  onChange={(e) => setBlacklistUrls(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCrawl} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Crawling...
                  </>
                ) : (
                  "Start Crawling"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="scrape">
          <Card>
            <CardHeader>
              <CardTitle>Scrape Website</CardTitle>
              <CardDescription>
                Extract specific content from a website using selectors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scrape-url">URL</Label>
                <Input
                  id="scrape-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="selectors">Selectors (one per line, format: key=selector)</Label>
                <Textarea
                  id="selectors"
                  placeholder="title=<title>(.*?)</title>\nheadings=<h1>(.*?)</h1>"
                  value={selectors}
                  onChange={(e) => setSelectors(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-headless"
                  checked={useHeadless}
                  onCheckedChange={(checked) => setUseHeadless(checked === true)}
                />
                <Label htmlFor="use-headless">Use Headless Chrome</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleScrape} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  "Start Scraping"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="render">
          <Card>
            <CardHeader>
              <CardTitle>Render Website</CardTitle>
              <CardDescription>
                Render a website with JavaScript using headless Chrome.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="render-url">URL</Label>
                <Input
                  id="render-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wait-time">Wait Time (ms)</Label>
                <Input
                  id="wait-time"
                  type="number"
                  value={waitTime}
                  onChange={(e) => setWaitTime(Number(e.target.value))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRender} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rendering...
                  </>
                ) : (
                  "Render Page"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="extract">
          <Card>
            <CardHeader>
              <CardTitle>Extract Text</CardTitle>
              <CardDescription>
                Extract plain text from a website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="extract-url">URL</Label>
                <Input
                  id="extract-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="extract-use-headless"
                  checked={useHeadless}
                  onCheckedChange={(checked) => setUseHeadless(checked === true)}
                />
                <Label htmlFor="extract-use-headless">Use Headless Chrome</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleExtractText} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  "Extract Text"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle>Monitor Website</CardTitle>
              <CardDescription>
                Monitor a website for changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monitor-url">URL</Label>
                <Input
                  id="monitor-url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cron">Cron Expression (optional)</Label>
                <Input
                  id="cron"
                  placeholder="*/30 * * * *"
                  value={cronExpression}
                  onChange={(e) => setCronExpression(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Example: */30 * * * * (every 30 minutes)
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monitor-use-headless"
                  checked={useHeadless}
                  onCheckedChange={(checked) => setUseHeadless(checked === true)}
                />
                <Label htmlFor="monitor-use-headless">Use Headless Chrome</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleMonitor} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Monitoring...
                  </>
                ) : (
                  "Check for Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {result && (
        <>
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Result</h2>
            
            {result.error ? (
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600">{result.error}</p>
                {result.details && <p className="text-red-500 text-sm mt-2">{result.details}</p>}
              </div>
            ) : (
              <div className="bg-white p-4 rounded-md border">
                <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

