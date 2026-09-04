import dbConnect from "@/lib/dbConnect";
import Destination from "@/models/Destination";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

interface DestinationItem {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
}

export default async function Home() {
  await dbConnect();
  const rawData = await Destination.find({}).sort({ createdAt: -1 }).lean();
  const destinations: DestinationItem[] = JSON.parse(JSON.stringify(rawData));

  async function addDestination(formData: FormData) {
    "use server";
    await dbConnect();

    const title = formData.get("title");
    const location = formData.get("location");
    const imageUrl = formData.get("imageUrl");
    const description = formData.get("description");

    // TypeScript type guard: guarantees all inputs are valid strings
    if (
      typeof title !== "string" ||
      typeof location !== "string" ||
      typeof imageUrl !== "string" ||
      typeof description !== "string"
    ) {
      return;
    }

    await Destination.create({
      title: title.trim(),
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      description: description.trim(),
    });

    revalidatePath("/");
  }

  return (
    <main className="min-h-screen p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Curated Travel Board
          </h1>
          <p className="text-zinc-400 mt-2">
            Built with Next.js App Router, Mongoose, and MongoDB Atlas.
          </p>
        </header>

        {/* In-page Creation Form */}
        <form
          action={addDestination}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Destination Name (e.g. Banff Lake)"
            required
            className="p-3 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-500"
          />
          <input
            name="location"
            placeholder="Location (e.g. Alberta, Canada)"
            required
            className="p-3 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-500"
          />
          <input
            name="imageUrl"
            placeholder="Image URL (Unsplash or direct image link)"
            required
            className="p-3 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-500 md:col-span-2"
          />
          <textarea
            name="description"
            rows={2}
            placeholder="Brief description..."
            required
            className="p-3 bg-zinc-800/60 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-zinc-500 md:col-span-2"
          />
          <button
            type="submit"
            className="md:col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg transition cursor-pointer"
          >
            Add Destination
          </button>
        </form>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm"
            >
              <div className="relative h-48 w-full bg-zinc-800">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                  {item.location}
                </span>
                <h2 className="text-xl font-bold mt-1">{item.title}</h2>
                <p className="text-sm text-zinc-400 mt-2 line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
