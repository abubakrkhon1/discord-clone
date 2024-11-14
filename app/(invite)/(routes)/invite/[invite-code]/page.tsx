import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface InviteCodePageProps {
    params: {
        "invite-code": string;
    };
}

const InvitePage = async ({ params }: InviteCodePageProps) => {
    const params1 = await params; // Directly access inviteCode from params

    const inviteCode = params1["invite-code"];

    const { redirectToSignIn } = await auth();

    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    }

    if (!inviteCode) return redirect('/');

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) return redirect(`/servers/${existingServer.id}`);

    const server = await db.server.update({
        where: {
            inviteCode: inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    if (server) return redirect(`/servers/${server.id}`);

    return null;
}

export default InvitePage;