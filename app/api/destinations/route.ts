import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Destination from "@/models/Destination";

export async function GET() {
  try {
    await dbConnect();
    const destinations = await Destination.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: destinations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const destination = await Destination.create(body);
    return NextResponse.json(
      { success: true, data: destination },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
