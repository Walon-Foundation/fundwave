import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/core/helpers/formatDate";
import { Comment } from "@/core/types/types";
import { ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";


export default function CommentCard({comments}:{comments:Comment[]}) {
  return (
    <Card>
    <CardContent className="p-6">
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-blue-500 bg-blue-50">
                  {comment.campaignName}
                </Badge>
                <span className="text-xs text-gray-500">{formatDate(comment.createdAt as string)}</span>
              </div>
              <p className="text-sm">{comment.description}</p>
              <div className="mt-2 flex justify-end">
                <Link
                  href={`/campaign/${comment.campaignId}`}
                  className="text-xs text-blue-500 hover:underline flex items-center"
                >
                  View Campaign <ChevronRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <MessageSquare className="h-8 w-8 mb-2 text-gray-300" />
          <p>No comments yet</p>
        </div>
      )}
    </CardContent>
  </Card>
  )
}
