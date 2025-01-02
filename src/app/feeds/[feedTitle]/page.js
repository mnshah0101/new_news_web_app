import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getArticles(feedTitle) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/feed?feed_title=${encodeURIComponent(
        feedTitle
      )}`,
      { cache: 'no-store' } // Disable caching to always get fresh data
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
    
    const data = await res.json();
    return { articles: data.articles || [], error: null };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { articles: [], error: error.message };
  }
}

export default async function FeedArticlesPage({ params }) {
  // Await the params object before accessing its properties
  const { feedTitle } = await params;
  const decodedFeedTitle = decodeURIComponent(feedTitle);
  
  const { articles, error } = await getArticles(decodedFeedTitle);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Articles from {decodedFeedTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Link href="/feeds" className="text-blue-600 hover:underline mt-4 block">
                Return to Feeds
              </Link>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">No articles found for this feed.</p>
              <Link href="/feeds" className="text-blue-600 hover:underline mt-4 block">
                Return to Feeds
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date Processed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {article.title || article.page_title || "Untitled"}
                        </Link>
                      </TableCell>
                      <TableCell>{article.author || "Unknown"}</TableCell>
                      <TableCell>
                        {new Date(article.date_processed).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
