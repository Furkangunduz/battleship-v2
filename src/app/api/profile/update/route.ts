import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function PUT(req: Request) {
  try {
    const { name, email, image }: { name: string; email: string; image: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const user = await db.get(`user:${session.user.id}`);

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updatedUserData = {
      ...user,
      name,
      email,
      image,
    } as User;

    await db.set(`user:${session.user.id}`, JSON.stringify(updatedUserData));

    return new Response("OK");
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
