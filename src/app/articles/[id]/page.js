// app/articles/[id]/page.jsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Define an asynchronous Server Component
export default async function ArticlePage({ params }) {
  const { id } = params;

  // Fetch the article data from the server API
  let article = null;
  let error = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/article?id=${id}`, {
      cache: "no-store", // Disable caching for fresh data
    });

    if (!res.ok) {
      if (res.status === 404) {
        error = "Article not found.";
      } else {
        error = "Failed to fetch the article.";
      }
    } else {
      article = await res.json();
    }
  } catch (err) {
    console.error("Error fetching article:", err);
    error = "An unexpected error occurred.";
  }

  // Handle loading state (optional in Server Components)
  if (!article && !error) {
    // Render a skeleton loader
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Loading Article...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {error === "Article not found." ? "Article Not Found" : "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">{error}</p>
            <div className="flex justify-center mt-4">
              <Link href="/" className="text-blue-600 hover:underline">
                Go Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the article content
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {article.title || article.page_title || "Untitled"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-semibold">Author:</p>
            <p>{article.author || "Unknown"}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Source Link:</p>
            <a
              href={article.source_link}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.source_link}
            </a>
          </div>
          <div className="mb-4">
            <p className="font-semibold">PDF URL:</p>
            <a
              href={article.pdf_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {article.pdf_url}
            </a>
          </div>
          <div>
            <p className="font-semibold mb-2">PDF Content:</p>
            <ScrollArea className="h-[400px] rounded-md border p-4 bg-gray-50">
              {article.content || "No content extracted."}
            </ScrollArea>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-blue-600 hover:underline">
              &larr; Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
