"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedsPage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feeds`);
        if (!res.ok) {
          throw new Error("Failed to fetch feeds");
        }
        const data = await res.json();
        setFeeds(data.feed_titles || []);
      } catch (error) {
        console.error("Failed to fetch feeds:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Available Feeds
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
              <Link
                href="/"
                className="text-blue-600 hover:underline mt-4 block"
              >
                Return to Home
              </Link>
            </div>
          ) : feeds.length === 0 ? (
            <p className="text-center text-gray-500">No feeds available.</p>
          ) : (
            <div className="grid gap-4">
              {feeds.map((feed, index) => (
                <Link
                  key={index}
                  href={`/feeds/${encodeURIComponent(feed)}`}
                  className="block p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium">{feed}</h3>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
