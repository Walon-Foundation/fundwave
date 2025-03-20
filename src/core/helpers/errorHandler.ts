import { NextResponse } from "next/server";

export const errorHandler = (
    statusCode: number,
    message: string,
    error: Error | null | string | unknown
) => {
    console.error("Error:", error);

    // Process error details safely
    let errorDetails = null;
    if (error instanceof Error) {
        errorDetails = error.message; 
    } else if (typeof error === "string") {
        errorDetails = error;
    }

    return NextResponse.json(
        {
            success: false,
            message,
            ...(process.env.NODE_ENV !== "production" && errorDetails ? { error: errorDetails } : {}),
        },
        { status: statusCode }
    );
};
