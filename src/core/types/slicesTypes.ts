import { EntityState } from "@reduxjs/toolkit";
import { Campaign,Comment } from "./types";


export interface CampaignSice extends EntityState<Campaign, string> {
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}

export interface CommentSlice extends EntityState<Comment, string>{
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}
