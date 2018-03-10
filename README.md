# Peanuts

> A simple (CLI) tool that automatically trades cryptocurrencies based on a defined threshold

[![Build Status](https://travis-ci.org/rasshofer/peanuts.svg)](https://travis-ci.org/rasshofer/peanuts)
[![Dependency Status](https://david-dm.org/rasshofer/peanuts/status.svg)](https://david-dm.org/rasshofer/peanuts)
[![Dependency Status](https://david-dm.org/rasshofer/peanuts/dev-status.svg)](https://david-dm.org/rasshofer/peanuts)

Diversification is a common investment technique of spreading investments around to reduce the volatility of a portfolio over time. Peanuts allows building a diversified cryptocurrency portfolio by buying coins you don’t have already and selling those you have based on defined thresholds. It all happens automatically and is supposed to be configured as a cronjob that is executed once per minute/hour/day.

<img src="https://cdn.rawgit.com/rasshofer/peanuts/master/screenshot.png" alt="Peanuts" width="750" height="452">

## Requirements

* Node.js v8+

## Installation

```shell
npm install -g peanuts
```

## Usage

```shell
$ peanuts {OPTIONS}
```

## Configuration

Peanuts is configured using the following options via a configuration file, environment variables, and/or command-line arguments.

First of all, Peanuts looks for a JSON file called `peanuts.json` within the current working directory.

```json
{
  "base": "eur",
  "currency": "btc",
  "top": "10",
  "amount": "50",
  "threshold": "150",
  "order": [
    "binance"
  ],
  "blacklist": [
    "btc",
    "eth",
    "ltc"
  ]
}
```

Afterwards, Peanuts will take environment variables into account.

```shell
base=eur currency=btc top=20 amount=20 threshold=150 peanuts
```

Concluding, Peanuts will take command-line arguments into account.

```shell
peanuts --base=eur --currency=btc --top=20 --amount=20 --threshold=150 --blacklist=BTC --blacklist=ETH --blacklist=LTC
```

(All options are merged into a single configuration using the hierarchy described above.)

## Options

Due to the fact that there is no all-in-one exchange service that offers all currencies, you can add multiple exchanges to Peanuts.

### Purchases

Now that Peanuts is able to perform buys for you, you need to specify what kind of buys you want to be performed.

#### `base`

The base currency used for specifying the desired amount.

Example: `USD`

Default: `EUR`

#### `currency`

The cryptocurrency used for actually buying cryptocurrencies (as most exchanges only accept other cryptocurrencies like Bitcoin for buying altcoins).

Example: `ETH`

Default: `BTC`

#### `top`

The quantity of currencies you want to check starting at #1 of the [CoinMarketCap](https://coinmarketcap.com/) ranking.

Example: `20` (#1—#20)

Default: `10` (#1—#10)

#### `amount`

Amount of your base currency to buy currencies for.

Example: `20`

Default: `10`

#### `threshold`

Growth rate to sell currencies at expressed as a percentage based on (and including) the buying price (= 100%). For instance `200` equals 200% and means that your currencies are sold as soon as they doubled in value.

Example: `150`

Default: `200`

#### `storage`

Temporary storage (= JSON file) where your portfolio (currencies held including their buying cost) is stored.

Example: `/Users/johndoe/Desktop/portfolio.json`

Default: `storage.json` (within the current working directory)

#### `blacklist`

List of currencies (= their symbols) that shall be ignored/skipped.

Example: `['BTC', 'ETH']`

Default: `[]`

#### `whitelist`

List of currencies (= their symbols) that shall be traded without exception. Any other currency will be ignored/skipped.

Example: `['XRP', 'XLM']`

Default: `[]`

#### `order`

Ranking of your preferred exchange services. For instance `['kraken', 'bitfinex']` would always try to buy/sell your portfolio using Kraken but fall back on Bitfinex in case Kraken does not support the respective currency.

Example: `['kraken', 'bitfinex']`

Default: `[]`

### Exchanges

Peanuts uses [ccxt](https://github.com/ccxt/ccxt) for trades and currently supports the following 101 cryptocurrency exchange markets and trading APIs.

| Exchange                                                  | Required Credentials                                       | Documentation                                                                                                                                                                  |
| --------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [1Broker](https://1broker.com)                            | `_1broker_key`                                             | [https://1broker.com/?c=en/content/api-documentation](https://1broker.com/?c=en/content/api-documentation)                                                                     |
| [1BTCXE](https://1btcxe.com)                              | `_1btcxe_key` / `_1btcxe_secret`                           | [https://1btcxe.com/api-docs.php](https://1btcxe.com/api-docs.php)                                                                                                             |
| [ACX](https://acx.io)                                     | `acx_key` / `acx_secret`                                   | [https://acx.io/documents/api_v2](https://acx.io/documents/api_v2)                                                                                                             |
| [Allcoin](https://www.allcoin.com)                        | `allcoin_key` / `allcoin_secret`                           | [https://www.allcoin.com/About/APIReference](https://www.allcoin.com/About/APIReference)                                                                                       |
| [ANXPro](https://anxpro.com)                              | `anxpro_key` / `anxpro_secret`                             | [http://docs.anxv2.apiary.io](http://docs.anxv2.apiary.io)                                                                                                                     |
| [Bibox](https://www.bibox.com)                            | `bibox_key` / `bibox_secret`                               | [https://github.com/Biboxcom/api_reference/wiki/home_en](https://github.com/Biboxcom/api_reference/wiki/home_en)                                                               |
| [Binance](https://www.binance.com/?ref=18976212)          | `binance_key` / `binance_secret`                           | [https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md](https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md) |
| [Bit2C](https://www.bit2c.co.il)                          | `bit2c_key` / `bit2c_secret`                               | [https://www.bit2c.co.il/home/api](https://www.bit2c.co.il/home/api)                                                                                                           |
| [BitBay](https://bitbay.net)                              | `bitbay_key` / `bitbay_secret`                             | [https://bitbay.net/public-api](https://bitbay.net/public-api)                                                                                                                 |
| [Bitcoin.co.id](https://www.bitcoin.co.id)                | `bitcoincoid_key` / `bitcoincoid_secret`                   | [https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf](https://vip.bitcoin.co.id/downloads/BITCOINCOID-API-DOCUMENTATION.pdf)                                 |
| [Bitfinex](https://www.bitfinex.com)                      | `bitfinex_key` / `bitfinex_secret`                         | [https://bitfinex.readme.io/v1/docs](https://bitfinex.readme.io/v1/docs)                                                                                                       |
| [Bitfinex v2](https://www.bitfinex.com)                   | `bitfinex2_key` / `bitfinex2_secret`                       | [https://bitfinex.readme.io/v2/docs](https://bitfinex.readme.io/v2/docs)                                                                                                       |
| [bitFlyer](https://bitflyer.jp)                           | `bitflyer_key` / `bitflyer_secret`                         | [https://bitflyer.jp/API](https://bitflyer.jp/API)                                                                                                                             |
| [Bithumb](https://www.bithumb.com)                        | `bithumb_key` / `bithumb_secret`                           | [https://www.bithumb.com/u1/US127](https://www.bithumb.com/u1/US127)                                                                                                           |
| [Bitlish](https://bitlish.com)                            | `bitlish_key`                                              | [https://bitlish.com/api](https://bitlish.com/api)                                                                                                                             |
| [BitMarket](https://www.bitmarket.pl)                     | `bitmarket_key` / `bitmarket_secret`                       | [https://www.bitmarket.net/docs.php?file=api_public.html](https://www.bitmarket.net/docs.php?file=api_public.html)                                                             |
| [BitMEX](https://www.bitmex.com)                          | `bitmex_key` / `bitmex_secret`                             | [https://www.bitmex.com/app/apiOverview](https://www.bitmex.com/app/apiOverview)                                                                                               |
| [Bitso](https://bitso.com)                                | `bitso_key` / `bitso_secret`                               | [https://bitso.com/api_info](https://bitso.com/api_info)                                                                                                                       |
| [Bitstamp](https://www.bitstamp.net)                      | `bitstamp_key` / `bitstamp_secret` / `bitstamp_user`       | [https://www.bitstamp.net/api](https://www.bitstamp.net/api)                                                                                                                   |
| [Bitstamp v1](https://www.bitstamp.net)                   | `bitstamp1_key` / `bitstamp1_secret` / `bitstamp1_user`    | [https://www.bitstamp.net/api](https://www.bitstamp.net/api)                                                                                                                   |
| [Bittrex](https://bittrex.com)                            | `bittrex_key` / `bittrex_secret`                           | [https://bittrex.com/Home/Api](https://bittrex.com/Home/Api)                                                                                                                   |
| [Bit-Z](https://www.bit-z.com)                            | `bitz_key` / `bitz_secret`                                 | [https://www.bit-z.com/api.html](https://www.bit-z.com/api.html)                                                                                                               |
| [BL3P](https://bl3p.eu)                                   | `bl3p_key` / `bl3p_secret`                                 | [https://github.com/BitonicNL/bl3p-api/tree/master/docs](https://github.com/BitonicNL/bl3p-api/tree/master/docs)                                                               |
| [Bleutrade](https://bleutrade.com)                        | `bleutrade_key` / `bleutrade_secret`                       | [https://bleutrade.com/help/API](https://bleutrade.com/help/API)                                                                                                               |
| [Braziliex](https://braziliex.com/)                       | `braziliex_key` / `braziliex_secret`                       | [https://braziliex.com/exchange/api.php](https://braziliex.com/exchange/api.php)                                                                                               |
| [BtcBox](https://www.btcbox.co.jp/)                       | `btcbox_key` / `btcbox_secret`                             | [https://www.btcbox.co.jp/help/asm](https://www.btcbox.co.jp/help/asm)                                                                                                         |
| [BTCChina](https://www.btcchina.com)                      | `btcchina_key` / `btcchina_secret`                         | [https://www.btcchina.com/apidocs](https://www.btcchina.com/apidocs)                                                                                                           |
| [BTCExchange](https://www.btcexchange.ph)                 | `btcexchange_key` / `btcexchange_secret`                   | [https://github.com/BTCTrader/broker-api-docs](https://github.com/BTCTrader/broker-api-docs)                                                                                   |
| [BTC Markets](https://btcmarkets.net/)                    | `btcmarkets_key` / `btcmarkets_secret`                     | [https://github.com/BTCMarkets/API](https://github.com/BTCMarkets/API)                                                                                                         |
| [BtcTrade.im](https://www.btctrade.im)                    | `btctradeim_key` / `btctradeim_secret`                     | [https://www.btctrade.im/help.api.html](https://www.btctrade.im/help.api.html)                                                                                                 |
| [BTC Trade UA](https://btc-trade.com.ua)                  | `btctradeua_key` / `btctradeua_secret`                     | [https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit](https://docs.google.com/document/d/1ocYA0yMy_RXd561sfG3qEPZ80kyll36HUxvCRe5GbhE/edit)   |
| [BTCTurk](https://www.btcturk.com)                        | `btcturk_key` / `btcturk_secret`                           | [https://github.com/BTCTrader/broker-api-docs](https://github.com/BTCTrader/broker-api-docs)                                                                                   |
| [BTCX](https://btc-x.is)                                  | `btcx_key` / `btcx_secret`                                 | [https://btc-x.is/custom/api-document.html](https://btc-x.is/custom/api-document.html)                                                                                         |
| [BX.in.th](https://bx.in.th)                              | `bxinth_key` / `bxinth_secret`                             | [https://bx.in.th/info/api](https://bx.in.th/info/api)                                                                                                                         |
| [C-CEX](https://c-cex.com)                                | `ccex_key` / `ccex_secret`                                 | [https://c-cex.com/?id=api](https://c-cex.com/?id=api)                                                                                                                         |
| [CEX.IO](https://cex.io)                                  | `cex_key` / `cex_secret` / `cex_user`                      | [https://cex.io/cex-api](https://cex.io/cex-api)                                                                                                                               |
| [CHBTC](https://trade.chbtc.com/api)                      | `chbtc_key` / `chbtc_secret`                               | [https://www.chbtc.com/i/developer](https://www.chbtc.com/i/developer)                                                                                                         |
| [ChileBit](https://chilebit.net)                          | `chilebit_key` / `chilebit_secret`                         | [https://blinktrade.com/docs](https://blinktrade.com/docs)                                                                                                                     |
| [COBINHOOD](https://cobinhood.com)                        | `cobinhood_key`                                            | [https://cobinhood.github.io/api-public](https://cobinhood.github.io/api-public)                                                                                               |
| [coincheck](https://coincheck.com)                        | `coincheck_key` / `coincheck_secret`                       | [https://coincheck.com/documents/exchange/api](https://coincheck.com/documents/exchange/api)                                                                                   |
| [CoinEgg](https://www.coinegg.com)                        | `coinegg_key` / `coinegg_secret`                           | [https://www.coinegg.com/explain.api.html](https://www.coinegg.com/explain.api.html)                                                                                           |
| [CoinExchange](https://www.coinexchange.io)               | `coinexchange_key` / `coinexchange_secret`                 | [https://coinexchangeio.github.io/slate/](https://coinexchangeio.github.io/slate/)                                                                                             |
| [coinfloor](https://www.coinfloor.co.uk)                  | `coinfloor_key` / `coinfloor_secret` / `coinfloor_user`    | [https://github.com/coinfloor/api](https://github.com/coinfloor/api)                                                                                                           |
| [Coingi](https://coingi.com)                              | `coingi_key` / `coingi_secret`                             | [http://docs.coingi.apiary.io/](http://docs.coingi.apiary.io/)                                                                                                                 |
| [CoinMate](https://coinmate.io)                           | `coinmate_key` / `coinmate_secret` / `coinmate_user`       | [http://docs.coinmate.apiary.io](http://docs.coinmate.apiary.io)                                                                                                               |
| [Coinsecure](https://coinsecure.in)                       | `coinsecure_key`                                           | [https://api.coinsecure.in](https://api.coinsecure.in)                                                                                                                         |
| [CoinSpot](https://www.coinspot.com.au)                   | `coinspot_key` / `coinspot_secret`                         | [https://www.coinspot.com.au/api](https://www.coinspot.com.au/api)                                                                                                             |
| [CoolCoin](https://www.coolcoin.com)                      | `coolcoin_key` / `coolcoin_secret`                         | [https://www.coolcoin.com/help.api.html](https://www.coolcoin.com/help.api.html)                                                                                               |
| [Cryptopia](https://www.cryptopia.co.nz)                  | `cryptopia_key` / `cryptopia_secret`                       | [https://www.cryptopia.co.nz/Forum/Category/45](https://www.cryptopia.co.nz/Forum/Category/45)                                                                                 |
| [DSX](https://dsx.uk)                                     | `dsx_key` / `dsx_secret`                                   | [https://api.dsx.uk](https://api.dsx.uk)                                                                                                                                       |
| [EXMO](https://exmo.me)                                   | `exmo_key` / `exmo_secret`                                 | [https://exmo.me/en/api_doc](https://exmo.me/en/api_doc)                                                                                                                       |
| [flowBTC](https://trader.flowbtc.com)                     | `flowbtc_key` / `flowbtc_secret` / `flowbtc_user`          | [http://www.flowbtc.com.br/api/](http://www.flowbtc.com.br/api/)                                                                                                               |
| [FoxBit](https://foxbit.exchange)                         | `foxbit_key` / `foxbit_secret`                             | [https://blinktrade.com/docs](https://blinktrade.com/docs)                                                                                                                     |
| [FYB-SE](https://www.fybse.se)                            | `fybse_key` / `fybse_secret`                               | [http://docs.fyb.apiary.io](http://docs.fyb.apiary.io)                                                                                                                         |
| [FYB-SG](https://www.fybsg.com)                           | `fybsg_key` / `fybsg_secret`                               | [http://docs.fyb.apiary.io](http://docs.fyb.apiary.io)                                                                                                                         |
| [Gatecoin](https://gatecoin.com)                          | `gatecoin_key` / `gatecoin_secret`                         | [https://gatecoin.com/api](https://gatecoin.com/api)                                                                                                                           |
| [Gate.io](https://gate.io/)                               | `gateio_key` / `gateio_secret`                             | [https://gate.io/api2](https://gate.io/api2)                                                                                                                                   |
| [GDAX](https://www.gdax.com)                              | `gdax_key` / `gdax_secret` / `gdax_password`               | [https://docs.gdax.com](https://docs.gdax.com)                                                                                                                                 |
| [Gemini](https://gemini.com)                              | `gemini_key` / `gemini_secret`                             | [https://docs.gemini.com/rest-api](https://docs.gemini.com/rest-api)                                                                                                           |
| [GetBTC](https://getbtc.org)                              | `getbtc_key` / `getbtc_secret`                             | [https://getbtc.org/api-docs.php](https://getbtc.org/api-docs.php)                                                                                                             |
| [HitBTC](https://hitbtc.com)                              | `hitbtc_key` / `hitbtc_secret`                             | [https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv1.md](https://github.com/hitbtc-com/hitbtc-api/blob/master/APIv1.md)                                                 |
| [HitBTC v2](https://hitbtc.com)                           | `hitbtc2_key` / `hitbtc2_secret`                           | [https://api.hitbtc.com](https://api.hitbtc.com)                                                                                                                               |
| [Huobi](https://www.huobi.com)                            | `huobi_key` / `huobi_secret`                               | [https://github.com/huobiapi/API_Docs_en/wiki](https://github.com/huobiapi/API_Docs_en/wiki)                                                                                   |
| [Huobi CNY](https://www.huobi.com)                        | `huobicny_key` / `huobicny_secret`                         | [https://github.com/huobiapi/API_Docs/wiki/REST_api_reference](https://github.com/huobiapi/API_Docs/wiki/REST_api_reference)                                                   |
| [Huobi Pro](https://www.huobi.pro)                        | `huobipro_key` / `huobipro_secret`                         | [https://github.com/huobiapi/API_Docs/wiki/REST_api_reference](https://github.com/huobiapi/API_Docs/wiki/REST_api_reference)                                                   |
| [Independent Reserve](https://www.independentreserve.com) | `independentreserve_key` / `independentreserve_secret`     | [https://www.independentreserve.com/API](https://www.independentreserve.com/API)                                                                                               |
| [itBit](https://www.itbit.com)                            | `itbit_key` / `itbit_secret`                               | [https://api.itbit.com/docs](https://api.itbit.com/docs)                                                                                                                       |
| [jubi.com](https://www.jubi.com)                          | `jubi_key` / `jubi_secret`                                 | [https://www.jubi.com/help/api.html](https://www.jubi.com/help/api.html)                                                                                                       |
| [Kraken](https://www.kraken.com)                          | `kraken_key` / `kraken_secret`                             | [https://www.kraken.com/en-us/help/api](https://www.kraken.com/en-us/help/api)                                                                                                 |
| [Kucoin](https://kucoin.com)                              | `kucoin_key` / `kucoin_secret`                             | [https://kucoinapidocs.docs.apiary.io](https://kucoinapidocs.docs.apiary.io)                                                                                                   |
| [Kuna](https://kuna.io)                                   | `kuna_key` / `kuna_secret`                                 | [https://kuna.io/documents/api](https://kuna.io/documents/api)                                                                                                                 |
| [LakeBTC](https://www.lakebtc.com)                        | `lakebtc_key` / `lakebtc_secret`                           | [https://www.lakebtc.com/s/api_v2](https://www.lakebtc.com/s/api_v2)                                                                                                           |
| [Liqui](https://liqui.io)                                 | `liqui_key` / `liqui_secret`                               | [https://liqui.io/api](https://liqui.io/api)                                                                                                                                   |
| [LiveCoin](https://www.livecoin.net)                      | `livecoin_key` / `livecoin_secret`                         | [https://www.livecoin.net/api?lang=en](https://www.livecoin.net/api?lang=en)                                                                                                   |
| [luno](https://www.luno.com)                              | `luno_key` / `luno_secret`                                 | [https://www.luno.com/en/api](https://www.luno.com/en/api)                                                                                                                     |
| [Lykke](https://www.lykke.com)                            | `lykke_key`                                                | [https://hft-api.lykke.com/swagger/ui/](https://hft-api.lykke.com/swagger/ui/)                                                                                                 |
| [Mercado Bitcoin](https://www.mercadobitcoin.com.br)      | `mercado_key` / `mercado_secret`                           | [https://www.mercadobitcoin.com.br/api-doc](https://www.mercadobitcoin.com.br/api-doc)                                                                                         |
| [MixCoins](https://mixcoins.com)                          | `mixcoins_key` / `mixcoins_secret`                         | [https://mixcoins.com/help/api/](https://mixcoins.com/help/api/)                                                                                                               |
| [Novaexchange](https://novaexchange.com)                  | `nova_key` / `nova_secret`                                 | [https://novaexchange.com/remote/faq](https://novaexchange.com/remote/faq)                                                                                                     |
| [OKCoin CNY](https://www.okcoin.cn)                       | `okcoincny_key` / `okcoincny_secret`                       | [https://www.okcoin.cn/rest_getStarted.html](https://www.okcoin.cn/rest_getStarted.html)                                                                                       |
| [OKCoin USD](https://www.okcoin.com)                      | `okcoinusd_key` / `okcoinusd_secret`                       | [https://www.okcoin.com/rest_getStarted.html](https://www.okcoin.com/rest_getStarted.html)                                                                                     |
| [OKEX](https://www.okex.com)                              | `okex_key` / `okex_secret`                                 | [https://www.okex.com/rest_getStarted.html](https://www.okex.com/rest_getStarted.html)                                                                                         |
| [Paymium](https://www.paymium.com)                        | `paymium_key` / `paymium_secret`                           | [https://github.com/Paymium/api-documentation](https://github.com/Paymium/api-documentation)                                                                                   |
| [Poloniex](https://poloniex.com)                          | `poloniex_key` / `poloniex_secret`                         | [https://poloniex.com/support/api/](https://poloniex.com/support/api/)                                                                                                         |
| [QRYPTOS](https://www.qryptos.com)                        | `qryptos_key` / `qryptos_secret`                           | [https://developers.quoine.com](https://developers.quoine.com)                                                                                                                 |
| [QuadrigaCX](https://www.quadrigacx.com)                  | `quadrigacx_key` / `quadrigacx_secret` / `quadrigacx_user` | [https://www.quadrigacx.com/api_info](https://www.quadrigacx.com/api_info)                                                                                                     |
| [QUOINEX](https://quoinex.com/)                           | `quoinex_key` / `quoinex_secret`                           | [https://developers.quoine.com](https://developers.quoine.com)                                                                                                                 |
| [SouthXchange](https://www.southxchange.com)              | `southxchange_key` / `southxchange_secret`                 | [https://www.southxchange.com/Home/Api](https://www.southxchange.com/Home/Api)                                                                                                 |
| [SurBitcoin](https://surbitcoin.com)                      | `surbitcoin_key` / `surbitcoin_secret`                     | [https://blinktrade.com/docs](https://blinktrade.com/docs)                                                                                                                     |
| [TheRockTrading](https://therocktrading.com)              | `therock_key` / `therock_secret`                           | [https://api.therocktrading.com/doc/v1/index.html](https://api.therocktrading.com/doc/v1/index.html)                                                                           |
| [Tidex](https://tidex.com)                                | `tidex_key` / `tidex_secret`                               | [https://tidex.com/exchange/public-api](https://tidex.com/exchange/public-api)                                                                                                 |
| [UrduBit](https://urdubit.com)                            | `urdubit_key` / `urdubit_secret`                           | [https://blinktrade.com/docs](https://blinktrade.com/docs)                                                                                                                     |
| [Vaultoro](https://www.vaultoro.com)                      | `vaultoro_key` / `vaultoro_secret`                         | [https://api.vaultoro.com](https://api.vaultoro.com)                                                                                                                           |
| [VBTC](https://vbtc.exchange)                             | `vbtc_key` / `vbtc_secret`                                 | [https://blinktrade.com/docs](https://blinktrade.com/docs)                                                                                                                     |
| [VirWoX](https://www.virwox.com)                          | `virwox_key` / `virwox_login` / `virwox_password`          | [https://www.virwox.com/developers.php](https://www.virwox.com/developers.php)                                                                                                 |
| [WEX](https://wex.nz)                                     | `wex_key` / `wex_secret`                                   | [https://wex.nz/api/3/docs](https://wex.nz/api/3/docs)                                                                                                                         |
| [xBTCe](https://www.xbtce.com)                            | `xbtce_key` / `xbtce_secret` / `xbtce_user`                | [https://www.xbtce.com/tradeapi](https://www.xbtce.com/tradeapi)                                                                                                               |
| [YoBit](https://www.yobit.net)                            | `yobit_key` / `yobit_secret`                               | [https://www.yobit.net/en/api/](https://www.yobit.net/en/api/)                                                                                                                 |
| [YUNBI](https://yunbi.com)                                | `yunbi_key` / `yunbi_secret`                               | [https://yunbi.com/documents/api/guide](https://yunbi.com/documents/api/guide)                                                                                                 |
| [Zaif](https://zaif.jp)                                   | `zaif_key` / `zaif_secret`                                 | [http://techbureau-api-document.readthedocs.io/ja/latest/index.html](http://techbureau-api-document.readthedocs.io/ja/latest/index.html)                                       |
| [ZB](https://trade.zb.com/api)                            | `zb_key` / `zb_secret`                                     | [https://www.zb.com/i/developer](https://www.zb.com/i/developer)                                                                                                               |

## Changelog

* 2.0.0
  * Initial version

## Thanks

Special thanks to [Robert Kowalski](https://kowalski.gd/) for handing over the `peanuts` package name on npm to me. Please check out [robertkowalski/peanuts](https://github.com/robertkowalski/peanuts) in case you’re looking for the code of versions <2.0.0.

## Disclaimer

You use Peanuts at your own risk. I would only recommend trying out Peanuts with small amounts you are willing to lose for educational purposes. Running a bot (and trading in general) requires careful study of the risks and parameters. Wrong settings can cause a major loss. Peanuts relies on 3rd party APIs which may fail at any time and is experimental software which also may fail at any time. Thus never leave Peanuts un-monitored for long periods of time. Be prepared to stop it if too much loss occurs. You alone are responsible for anything that happens when you’re live-trading.

## License

Copyright (c) 2018 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
