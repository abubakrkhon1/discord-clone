import { ChatHeader } from '@/components/chat/chat-header';
import { getOrCreateConverstaion } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const MemberIdPage = async ({
  params
}: MemberIdPageProps) => {
  const {serverId, memberId} = await params;

  const profile = await currentProfile();

  if(!profile) redirect("/sign-in");

  const currentMember = await db.member.findFirst({
    where:{
      serverId: serverId,
      profileId: profile.id,
    },
    include:{
      profile:true,
    }
  })

  if(!currentMember) return redirect("/");

  const conversation = await getOrCreateConverstaion(currentMember.id, memberId);

  if(!conversation) return redirect(`/servers/${serverId}`);

  const {memberOne, memberTwo} = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type='conversation'
      />
    </div>
  )
}

export default MemberIdPage