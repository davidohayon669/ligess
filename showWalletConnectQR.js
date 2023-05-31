require('dotenv').config()

const { getPublicKey } = require('nostr')
const qrcode = require('qrcode-terminal');

const _relay = process.env.LIGESS_NOSTR_WALLET_CONNECT_RELAY
const _nostrWalletConnectEncryptPrivKey = process.env.LIGESS_NOSTR_WALLET_CONNECT_PRIVATE_KEY
const _nostrWalletConnectEncryptPubKey = _nostrWalletConnectEncryptPrivKey ? getPublicKey(_nostrWalletConnectEncryptPrivKey) : null

const nostrConnectURL = `nostrwalletconnect://${_nostrWalletConnectEncryptPubKey}?relay=${encodeURI(_relay)}&secret=${_nostrWalletConnectEncryptPrivKey}`

console.log(nostrConnectURL)
qrcode.generate(nostrConnectURL, {small: true})
