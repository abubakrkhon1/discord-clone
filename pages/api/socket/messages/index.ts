import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;

        if (!profile) return res.status(401).json("Unauthorized");
        if (!serverId) return res.status(401).json("Server ID Missing");
        if (!channelId) return res.status(401).json("Channel ID Missing");
        if (!content) return res.status(401).json("Content Missing");

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        if (!server) return res.status(404).json("Server Not Found");

        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        if (!channel) return res.status(404).json("Channel Not Found");

        const member = await server.members.find((member) => member.profileId === profile.id);

        if (!member) return res.status(404).json("Member Not Found");

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,

            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message)

    } catch (error) {
        console.log("MESSAGES_POST", error);
        return res.status(500).json({ message: "Internal Error" })
    }
}