import * as l from '../../core/index';

// TODO: Android version also has "unknonwn-social", "evernote" and
// "evernote-sandbox""evernote" in the list, considers "google-openid"
// to be enterprise and doesn't contain "salesforce-community". See
// https://github.com/authok/Lock.Android/blob/98262cb7110e5d1c8a97e1129faf2621c1d8d111/lock/src/main/java/com/authok/android/lock/utils/Strategies.java
export const STRATEGIES = {
  apple: 'Apple',
  amazon: 'Amazon',
  aol: 'Aol',
  baidu: '百度',
  bitbucket: 'Bitbucket',
  box: 'Box',
  dropbox: 'Dropbox',
  dwolla: 'Dwolla',
  ebay: 'ebay',
  exact: 'Exact',
  facebook: 'Facebook',
  fitbit: 'Fitbit',
  github: 'GitHub',
  'google-openid': 'Google OpenId',
  'google-oauth2': 'Google',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  miicard: 'miiCard',
  paypal: 'PayPal',
  'paypal-sandbox': 'PayPal Sandbox',
  planningcenter: 'Planning Center',
  renren: '人人',
  salesforce: 'Salesforce',
  'salesforce-community': 'Salesforce Community',
  'salesforce-sandbox': 'Salesforce (sandbox)',
  evernote: 'Evernote',
  'evernote-sandbox': 'Evernote (sandbox)',
  shopify: 'Shopify',
  soundcloud: 'Soundcloud',
  thecity: 'The City',
  'thecity-sandbox': 'The City (sandbox)',
  thirtysevensignals: 'Basecamp',
  twitter: 'Twitter',
  vkontakte: 'vKontakte',
  windowslive: 'Microsoft Account',
  wordpress: 'Wordpress',
  yahoo: 'Yahoo!',
  yammer: 'Yammer',
  yandex: 'Yandex',
  tiktok: 'tiktok',
  douyin: '抖音',
  weibo: '新浪微博',
  line: 'Line',
  'wechat:mp:qrconnect': '微信公众号扫码关注登录',
  'wechat:miniprogram:qrconnect': '小程序扫码登录',
  'wechat:miniprogram:default': '小程序内登录',
  'wechat:webpage-authorization': '微信网页授权登录',
  'wechat:pc': '微信PC登录',
  'wechat:mobile': '微信手机端登录',
  'wechat:miniprogram:app-launch': 'APP拉起小程序登录',
};

export function displayName(connection) {
  if (['oauth1', 'oauth2'].indexOf(connection.get('strategy')) !== -1) {
    return connection.get('name');
  }
  return STRATEGIES[connection.get('strategy')];
}

export function socialConnections(m) {
  return l.connections(m, 'social');
}

export function authButtonsTheme(m) {
  return l.ui.authButtonsTheme(m);
}
