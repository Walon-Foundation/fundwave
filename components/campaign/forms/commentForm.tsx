import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";


export default function CommentForm({handleCommentSubmit, commentText, setCommentText, isLoading}: {handleCommentSubmit: (e:React.FormEvent<HTMLFormElement>)=>Promise<void>, commentText: string, setCommentText: React.Dispatch<React.SetStateAction<string>>, isLoading: boolean}) {
  return (
    <div className="pt-6 mt-6 border-t border-blue-100 px-6 sm:px-0">
    <h4 className="font-semibold text-blue-800 mb-3">Add a Comment</h4>
    <form onSubmit={handleCommentSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your thoughts about this campaign..."
          className="min-h-[120px] border-blue-200 focus-visible:ring-blue-400 pr-12 resize-y"
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {commentText.length}/500
        </div>
      </div>

      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-2 h-auto"
        disabled={!commentText.trim() || isLoading}
      >
        {isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  </div>
  )
}

