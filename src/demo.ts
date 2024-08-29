import RingCetral from '@rc-ex/core';
import fs from 'fs';

const rc = new RingCetral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });

  const posts = await rc.teamMessaging().v1().chats(process.env.GROUP_ID).posts().list();
  const post = posts.records?.find((p) => p.attachments && p.attachments?.length > 0);
  if (!post) {
    console.log('No post with attachments');
    return;
  }
  const fileUri = (post.attachments![0] as any).contentUri!;
  console.log(fileUri);
  const r = await rc.get<Buffer>(fileUri, undefined, { responseType: 'arraybuffer' });
  const content = r.data;
  console.log('binary data downloaded, length:', content.length);
  fs.writeFileSync('downloaded.pdf', content);
};
main();
