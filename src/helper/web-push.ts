import webPush from 'web-push';

const publicVapidKey = 'BEA5koZZE9-aUZvIDS2w1HqzbS5welevwtFAvwJJLfO_b8fXqsLNi80Fa_wRjXw154SJM3U3ux1vs_ZqkXIRqSY';
const privateVapidKey = 'RGuSAsy4KW14gE8vbdjAP_L7Ffmy3xitUj9d34YbM8U';

webPush.setVapidDetails(
  'mailto:vishnuprem5152@gmail.com',
  publicVapidKey,
  privateVapidKey
);

export default webPush;
