import { TabsContent } from "@/components/ui/tabs";
import CommentForm from "../forms/commentForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/core/helpers/formatDate";
import { Comment, Campaign, User } from "@/core/types/types";
import { Button } from "@/components/ui/button";
import {  Trash, } from "lucide-react";

export default function CommentSection({
  campaign,
  campaignComment,
  handleCommentSubmit,
  commentText,
  setCommentText,
  isLoading,
  user
}: {
  handleCommentSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  campaign: Campaign;
  campaignComment: Comment[];
  user:User
}) {
  return (
    <TabsContent value="comments" className="p-0 sm:p-6 animate-in fade-in-50">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-blue-100 pb-4 px-6 sm:px-0">
          <h3 className="text-lg font-semibold text-blue-800">
            Comments ({campaign.comments?.length || 0})
          </h3>
        </div>

        <div className="space-y-6 px-6 sm:px-0">
          {campaign?.comments && campaign?.comments?.length > 0 ? (
            <div className="space-y-6">
              {campaignComment?.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-center justify-between gap-3 md:gap-4 pb-6 border-b border-blue-100 transition-all hover:bg-blue-50/30 p-3 rounded-lg -mx-3"
                >
                  <div className="flex  gap-3 md:gap-4 pb-6 border-b border-blue-100 transition-all hover:bg-blue-50/30">
                  <Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0 border-2 border-blue-50 ring-2 ring-blue-100/50">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${comment?._id}`}
                      alt={comment?.username}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 font-medium">
                      {comment?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-blue-900">
                        {comment?.username}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment?.createdAt as string)}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm md:text-base break-words leading-relaxed">
                      {comment?.description}
                    </p>
                  </div>
                  </div>
                  <div>
                    {user?.username === comment?.username && <Button variant="ghost" size="lg" className="h-10 w-10" onClick={() => console.log("delete")}>
                      <Trash className="h-8 w-8 text-red-500"/>
                    </Button>}  
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-medium text-blue-800 mb-2">
                Join the conversation
              </h4>
              <p className="text-gray-600 max-w-md mx-auto">
                No comments yet. Be the first to share your thoughts about this
                campaign!
              </p>
            </div>
          )}
        </div>

        {/* Comment Form  */}
        <CommentForm
          handleCommentSubmit={handleCommentSubmit}
          commentText={commentText}
          setCommentText={setCommentText}
          isLoading={isLoading}
        />
      </div>
    </TabsContent>
  );
}
