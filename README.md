# LIGESS (**Lig**~~htning addr~~**ess**)

## Your personal Lightning address server
> Like an email address, but for your Bitcoin!
A massively simpler way for anyone to send you Bitcoin instantly on the Lightning Network.

*https://lightningaddress.com/*

## Prerequisite
- Nodejs >= 14
- Lightning node
- A domain name

## Supported Lightning implementation
- LND (LND with REST API)
- Eclair (v0.6.2)

## Installation

### Standalone
``` shell
git clone https://github.com/dolu89/ligess
cd ligess && yarn install
cp .env.example .env
# Edit .env with your info
yarn dev
```

### Using Docker compose
``` shell
git clone https://github.com/dolu89/ligess
# Edit `docker-compose.yml` with your details.
docker-compose up -d
```

## Usage
You should be able to access to https://YOURDOMAIN.COM/.well-known/lnurlp/USERNAME and get a valid [LUD-06](https://github.com/fiatjaf/lnurl-rfc/blob/luds/06.md) JSON response.

Now your Lightning address is configured as follow `USERNAME@YOURDOMAIN.COM`

### Installation for LND
In `.env` config file or `docker-compose` environment:
```
LIGESS_LN_BACKEND=LND
LIGESS_LND_REST=https://yourLNDRestAPI.com # can be an onion url
LIGESS_LND_MACAROON=hex string macaroon with invoices:read and invoices:write # should be a long (~265 character) string that you generate either on a CLI or in a UI.
```

#### Tip

The macaroon is what gives ligess the permissions to create invoices on behalf of your LND node.

The act of generating a macaroon is called "baking".  If you're paying for hosting an LND node, there should be a UI.  On Voltage, it's Connect > Other Macaroons > "Bake Other Macaroon".  For self-hosted, there is a CLI tool to generate it.

More information on macaroons can be found [here](https://github.com/lightningnetwork/lnd/blob/master/docs/macaroons.md).  

### Installation for Eclair
In `.env` config file or `docker-compose` environment:
```
LIGESS_LN_BACKEND=Eclair
LIGESS_ECLAIR_REST=http://eclair_rest_api # can be an onion url
LIGESS_ECLAIR_LOGIN=login
LIGESS_ECLAIR_PASSWORD=password
```

### Installation for LNbits
In `.env` config file or `docker-compose` environment:
```
LIGESS_LN_BACKEND=LNbits
LIGESS_LNBITS_DOMAIN=https://lnbits.com # can be replaced by your own LNbits isntance url
LIGESS_LNBITS_API_KEY=this1is2an3example # can be found at the right of your wallet page, under "API info" > "Invoice/read key"
```

### Using Tor
For the standalone install, be sure to have Tor running on your computer.

For the Docker install, add (or uncomment) the following lines in 'docker-compose.yml` in order to run Tor as a Docker container:
```yml
  tor:
    image: lncm/tor:latest
    restart: on-failure
    command: --SocksPort 0.0.0.0:9050
    expose:
      - 9050
```
Then specify the Tor proxy URL in `.env` config file or `docker-compose` environment:
```
LIGESS_TOR_PROXY_URL=socks5h://127.0.0.1:9050 # standalone installation
# or
LIGESS_TOR_PROXY_URL=socks5h://tor:9050 # docker installation
```

### Using Nostr
For sending zap notes on Nostr, you have to supply a Nostr private Key in `.env` that acts as the zap sender, in hex format.
```
LIGESS_NOSTR_ZAPPER_PRIVATE_KEY=this1is2an3example
```

To have zap requests working from web clients, and prevent CORS errors, make sure to add the following header to the web server configuration:
```
Access-Control-Allow-Origin "*";
```

#### Nostr metadata
To have ligess send a kind 0 (metadata) note, create a json file and refer to it with the `LIGESS_NOSTR_METADATA_FILE` property in the `.env` config file. An example is provided in `metadata.json.example`.

This note will be sent once per relay.

#### Nostr Wallet Connect
To enable Nostr Wallet Connect (aka One-Tap-Zaps), set `LIGESS_NOSTR_WALLET_CONNECT_SECRET` with a Nostr private key. It is recommended to generate a new public/private keypair for this, as it will be shared with the apps that use Nostr Wallet Connect feature and can spend funds from your node.

First, create a new macaroon, as Ligess needs the `offchain:write` permission to be able to pay invoices.

For LND, this can be done with:
```
lncli bakemacaroon invoices:write invoices:read offchain:write
```

Note: If this gives a permission denied error, all macaroons need to regenerated. See https://github.com/lightningnetwork/lnd/blob/master/macaroons/README.md#upgrading-from-v080-beta-or-earlier for more information on this.

Configure the external relay URL with `LIGESS_NOSTR_WALLET_CONNECT_RELAY`. Any incoming websocket connection on this URL should be forwarded to `/relay`.

It's also possible to configure a Relay Information Document (NIP-11) by specifying a file in `LIGESS_NOSTR_RELAY_INFORMATION`.

The connection string to use in the app is composed as follows: `nostrconnect://<pubkey>?relay:<relay url>&secret=<privkey>`.

If the private key and relay are configured, running `node showWalletConnectQR.js` will generate a QR code of this connection string that can be scanned by a mobile app.

For extra security, it's possible to require authentication on the relay connection. When using Amethyst, it will authenticate using the keys of the logged in user. To enforce this, set the pubkey of that user with `LIGESS_NOSTR_WALLET_CONNECT_PUBLIC_KEY`.

Damus is currently untested.

##### Budget limitations
Ligess has a mandatory budget configuration for Nostr Wallet Connect. This limits the amounts of a single zap, and of hour and day spends:
```
LIGESS_NOSTR_WALLET_CONNECT_BUDGET_ZAP=5000
LIGESS_NOSTR_WALLET_CONNECT_BUDGET_HOUR=25000
LIGESS_NOSTR_WALLET_CONNECT_BUDGET_DAY=100000
```
Zap amounts and timestamps for the last day are stored in a `zaps.json` file. This is to keep the budget in tact after a restart.

## Support this project
You can help me by contributing to this project or by donating to my Lightning address `dolu@bips.xyz`

Other donation methods are avaible here https://bips.xyz/support

The Nostr extensions are made by mutatrum, and tips for this are welcome on the Lightning address `mutatrum@hodl.camp`.