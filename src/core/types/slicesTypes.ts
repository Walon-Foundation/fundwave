import { EntityState } from "@reduxjs/toolkit";
import { Campaign } from "./types";


export interface CampaignSice extends EntityState<Campaign, string> {
    status: "idle" | "failed" | "success" | "loading",
    error: Error | null | string
}
