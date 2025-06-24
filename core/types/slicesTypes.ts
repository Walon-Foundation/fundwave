import { EntityState } from "@reduxjs/toolkit";
import { Campaign,Comment, Update } from "./types";


export interface CampaignSice extends EntityState<Campaign, string> {
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}

export interface CommentSlice extends EntityState<Comment, string>{
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}

export interface UpdateSlice extends EntityState<Update, string>{
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}
