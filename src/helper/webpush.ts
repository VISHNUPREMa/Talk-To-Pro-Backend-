import webpush from 'web-push';

// VAPID keys should only be generated once.
const vapidKeys = {
  publicKey: 'BATvUXb1-YuDZFwAl4MAsPWJkTPLIf0r64s_ufJMGGh9XapE-F64PpWRIxPjSCDyPyByluwv3F3ZiyfRvWXWHAw',
  privateKey: 'dwvO0dwKOkLQ6IPsvgUMgBSrdPZ3J-A5qUPvg405kks'
};

// Set VAPID details
webpush.setVapidDetails(
  'mailto:vishnuprem5152@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

