import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized: User session not found");
    return { userId };
};

export const ourFileRouter = {
    serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => handleAuth())
        .onUploadComplete(({ file }) => {}),

    messageFile: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "16MB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(({ file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
