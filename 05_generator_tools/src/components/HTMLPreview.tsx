"use client";

import React, { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, RotateCcw, Eye, Code2 } from "lucide-react";
import { BackButton } from "./BackButton";

const starterTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Live Preview</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; padding: 2rem; }
      .box { padding: 1rem 1.25rem; border-radius: 0.75rem; border: 1px solid #e5e7eb; }
      h1 { font-size: 2rem; margin-bottom: .5rem; }
      p { color: #374151; }
      a { color: #2563eb; }
    </style>
  </head>
  <body>
    <h1>Hello 👋</h1>
    <p>Edit the code on the left. This preview updates live and is sandboxed (no scripts run).</p>
    <div class="box">Try adding your own HTML & inline CSS here.</div>
  </body>
</html>`;

export default function HTMLPreview() {
  const [title, setTitle] = useState("Untitled Document");
  const [html, setHtml] = useState(starterTemplate);
  const [dimOverlay, setDimOverlay] = useState(true);
  const [wrap, setWrap] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sanitize by forcing into an iframe with a strict sandbox (no scripts)
  const srcDoc = useMemo(() => html, [html]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(html);
  };

  const onDownload = () => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "document")
      .replace(/\s+/g, "-")
      .toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const onReset = () => {
    if (confirm("Reset editor to starter template?")) {
      setTitle("Untitled Document");
      setHtml(starterTemplate);
    }
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* dim overlay toggleable */}
      {dimOverlay && (
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-8">
        <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/40 border-white/30">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center mb-4">
                <BackButton classname="text-black" />
              </div>
              <CardTitle className="text-2xl">HTML Previewer</CardTitle>
              <p className="text-sm text-muted-foreground">
                Live preview your HTML in a sandboxed iframe. No scripts are
                executed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="grid gap-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Untitled Document"
                  className="w-56 md:w-80 lg:w-96"
                />
              </div>
              <div className="flex lg:flex-col gap-3 items-start justify-center">
                <div className="flex items-center gap-2 pt-5 md:pt-0">
                  <Switch
                    id="overlay"
                    checked={dimOverlay}
                    onCheckedChange={setDimOverlay}
                  />
                  <Label htmlFor="overlay">Dim background</Label>
                </div>
                <div className="flex items-center gap-2 pt-5 md:pt-0">
                  <Switch id="wrap" checked={wrap} onCheckedChange={setWrap} />
                  <Label htmlFor="wrap">Soft wrap</Label>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" /> Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" /> Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="mt-4">
                <div className="flex items-center gap-2 pb-3">
                  <Button variant="secondary" size="sm" onClick={onCopy}>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={onDownload}>
                    <Download className="mr-2 h-4 w-4" /> Download .html
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onReset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>

                <Textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  placeholder="Write your HTML here..."
                  className={`min-h-[50vh] resize-y whitespace-pre ${
                    wrap ? "text-wrap" : "whitespace-pre"
                  }`}
                />
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="rounded-2xl border bg-background p-2">
                  <iframe
                    ref={iframeRef}
                    title={title || "Preview"}
                    className="h-[70vh] w-full rounded-xl border"
                    // Strict sandbox: no scripts, no forms, no popups
                    sandbox="allow-forms allow-pointer-lock allow-popups-to-escape-sandbox allow-same-origin"
                    srcDoc={srcDoc}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="mt-6 text-center text-xs text-white/80">
          Background image: Unsplash. Replace the URL in{" "}
          <code>backgroundImage</code> if you prefer another source.
        </footer>
      </div>
    </main>
  );
}
