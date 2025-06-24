import { NextResponse } from "next/server";

export const apiResponse = (message: string, statusCode: number, data: object | null = null) => {
    return NextResponse.json(
        {
            success: statusCode >= 200 && statusCode < 300,
            message,
            data
        },
        { status: statusCode }
    );
};
