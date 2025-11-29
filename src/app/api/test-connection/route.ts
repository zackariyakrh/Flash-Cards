import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return new Response(JSON.stringify({ message: "MongoDB connected!" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "MongoDB connection failed", details: err }), { status: 500 });
  }
}
