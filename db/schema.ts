
import { pgTable, text, integer, boolean, timestamp, jsonb, pgEnum} from "drizzle-orm/pg-core"


export const levelEnum = pgEnum("level",["success", "error","warning", "info"])
export const roleEnum = pgEnum("role",["user","admin"])
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "banned"]);
export const campaignStatusEnum = pgEnum("campaign_status", ["pending", "active", "rejected", "completed"]);

export const userTable = pgTable("users",{
    id:text("id").primaryKey().notNull(),
    clerkId:text("clerk_id").notNull(),
    name:text("name").notNull(),
    email: text("email").notNull().unique(),
    address:text("address"),
    age: integer("age"),
    phone:text("phone"),
    isKyc:boolean("isKyc").default(false).notNull(),
    amountContributed:integer("amountContribute").default(0).notNull(),
    isVerified:boolean("isVerifed").notNull().default(false),
    district:text("district"),
    occupation:text("occupation"),
    nationality:text("nationality").default("Sierra Leonean"),
    profilePicture:text("profilePicure"),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
    settings: jsonb("settings").default({
        notifications: {
            email: true,
            sms: false,
            push: true,
            campaignUpdates: true,
            donationReceipts: true,
            marketingEmails: false,
        },
        privacy: {
            profileVisibility: "public",
            showDonations: true,
            showCampaigns: true,
        },
        preferences: {
            language: "en",
            currency: "SLL",
            timezone: "Africa/Freetown",
        },
    }).notNull()
})

export const userDocumentTable = pgTable("userDocument",{
    id:text("id").primaryKey().notNull(),
    userId:text("userId").notNull().references(() => userTable.id, { onDelete:"cascade" }),
    documentType: text("documentType").notNull(),
    documentNumber:text("documentNumber").notNull(),
    documentPhoto: text("documentPhoto").notNull()
})


export const campaignTable = pgTable("campaigns",{
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull().unique(),
    fundingGoal:integer("fundingGoal").notNull(),
    amountReceived:integer("amountReceived").default(0).notNull(),
    location:text("location").notNull(),
    campaignEndDate:timestamp("campaignEndDate", { withTimezone: true}).notNull(),
    creatorId:text("creator_id").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
    creatorName:text("creatorName").notNull(),
    category:text("category").notNull(),
    image:text("images").notNull(),
    shortDescription:text("short description").notNull(),
    fullStory:text("fullStory").notNull(),
    tags:text("tags").array().notNull(),
    status: campaignStatusEnum("status").default("pending").notNull(),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})


export const commentTable = pgTable("comments",{
    id:text("id").primaryKey().notNull(),
    message:text("message").notNull(),
    username:text("username").notNull(),
    campaignId:text("campaignId").references(() => campaignTable.id, { onDelete:"cascade"}).notNull(),
    userId: text("userId").references(() => userTable.id, { onDelete: "cascade"}).notNull(),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const updateTable = pgTable("updates",{
    id:text("id").notNull().primaryKey(),
    title:text("title").notNull(),
    message:text("message").notNull(),
    campaignId:text("campaignId").notNull().references(() => campaignTable.id, { onDelete: "cascade"}),
    image:text("image"),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const paymentTable = pgTable("payments",{
    id:text("id").notNull().primaryKey(),
    userId:text("userId").references(() => userTable.id, {onDelete: "cascade"}),
    amount:integer("amount").notNull(),
    campaignId:text("campaignId").notNull().references(() => campaignTable.id, {onDelete:"cascade"}),
    monimeId:text("monimeId").notNull(),
    username:text("username"),
    isCompleted:boolean("isCompleted").notNull().default(false),
    createdAt:timestamp("createdAt", {withTimezone:true}).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt",{ withTimezone: true}).defaultNow().notNull(),
})

export const logTable = pgTable("logs",{
    id:text("id").primaryKey().notNull(),
    level:levelEnum("level").notNull(),
    timestamp:timestamp("timestamp", { withTimezone: true}).notNull(),
    category: text("category").notNull(),
    user:text("user").notNull(),
    details:text("details").notNull(),
    ipAddress:text("ipAddress").notNull(),
    userAgent:text("userAgent").notNull(),
    metaData:jsonb("metaData").notNull(),
})


export const teamMemberTable = pgTable("teamMember",{
    id:text("id").primaryKey().notNull(),
    name:text("name").notNull(),
    role:text("role").notNull(),
    bio:text("bio").notNull(),
    campaignId:text("campaignId").notNull().references(() => campaignTable.id, { onDelete: "cascade"}),
})

export const withdrawalStatusEnum = pgEnum("withdrawal_status", ["pending", "completed", "failed"]);

export const withdrawalTable = pgTable("withdrawals", {
    id: text("id").primaryKey().notNull(),
    userId: text("userId").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
    campaignId: text("campaignId").references(() => campaignTable.id, { onDelete: "cascade" }).notNull(),
    amount: integer("amount").notNull(),
    status: withdrawalStatusEnum("status").default("pending").notNull(),
    paymentDetails: jsonb("paymentDetails").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const reportTypeEnum = pgEnum("report_type", ["campaign", "user"]);
export const reportStatusEnum = pgEnum("report_status", ["pending", "investigating", "resolved"]);
export const reportPriorityEnum = pgEnum("report_priority", ["low", "medium", "high"]);

export const reportTable = pgTable("reports", {
    id: text("id").primaryKey().notNull(),
    type: reportTypeEnum("type").notNull(),
    targetId: text("targetId").notNull(),
    targetTitle: text("targetTitle").notNull(),
    reason: text("reason").notNull(),
    description: text("description"),
    reporterId: text("reporterId").references(() => userTable.id, { onDelete: "set null" }),
    reporterName: text("reporterName").notNull(),
    status: reportStatusEnum("status").default("pending").notNull(),
    priority: reportPriorityEnum("priority").default("medium").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const chatMessageTable = pgTable("chat_messages", {
    id: text("id").primaryKey().notNull(),
    campaignId: text("campaignId").references(() => campaignTable.id, { onDelete: "cascade" }).notNull(),
    userId: text("userId").references(() => userTable.id, { onDelete: "cascade" }).notNull(),
    userName: text("userName").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});



