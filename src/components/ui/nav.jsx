import Link from "next/link";
import { cn } from "@/lib/utils";

export function Nav({ className, ...props }) {
  return (
    <nav
      className={cn("border-b bg-background px-4 py-3", className)}
      {...props}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          New News
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/feeds"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Feeds
          </Link>
          {/* Add more navigation links as needed */}
        </div>
      </div>
    </nav>
  );
}
