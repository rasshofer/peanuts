#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const request = require('request-promise');
const leprechaun = require('leprechaun');
const roundTo = require('round-to');
const moment = require('moment');
const and = require('and');
const ccxt = require('ccxt');

const mapping = {
  MIOTA: 'IOTA'
};

(async () => {
  nconf.argv().env().file({
    file: path.resolve(process.cwd(), 'peanuts.json')
  }).defaults({
    base: 'EUR',
    currency: 'BTC',
    top: 10,
    amount: 10,
    threshold: 200,
    storage: path.resolve(__dirname, 'storage.json'),
    blacklist: [],
    whitelist: [],
    order: []
  });

  const config = nconf.get();
  const storage = path.resolve(__dirname, config.storage);

  let portfolio = {};

  try {
    portfolio = JSON.parse(fs.readFileSync(storage, 'utf8'));
  } catch (e) { } // eslint-disable-line no-empty

  if (config.threshold <= 100) {
    leprechaun.error(`Your threshold (= ${config.threshold}%) is ${config.threshold < 100 ? 'below' : 'equal to'} 100% – this does not make any sense`);
    process.exit(1);
  }

  const credentials = {
    apiKey: 'key',
    secret: 'secret',
    uid: 'user',
    login: 'login',
    password: 'password'
  };

  const exchanges = (await Promise.all(ccxt.exchanges.filter((exchange) => { return config[`${exchange}_key`]; }).map(async (exchange) => {
    const instance = new ccxt[exchange]();

    Object.keys(credentials).forEach((credential) => {
      if (instance.requiredCredentials[credential]) {
        if (!config[`${exchange}_${credentials[credential]}`]) {
          leprechaun.error(`Credential "${exchange}_${credentials[credential]}" is missing for ${instance.name}`);
          process.exit(1);
        }
        instance[credential] = config[`${exchange}_${credentials[credential]}`];
      }
    });

    await instance.loadMarkets();

    return new Promise((resolve) => {
      resolve(instance);
    });
  }))).sort((a, b) => {
    let aIndex = config.order.indexOf(a.id);
    let bIndex = config.order.indexOf(b.id);

    if (aIndex === -1) {
      aIndex = Infinity;
    }

    if (bIndex === -1) {
      bIndex = Infinity;
    }

    return aIndex - bIndex;
  });

  if (!exchanges.length) {
    leprechaun.error('Not a single exchange seems to be configured');
    process.exit(1);
  }

  const exchangeNames = exchanges.map((exchange) => {
    return exchange.name;
  });

  leprechaun.info(`Using ${and(exchangeNames, 'and')} as ${exchangeNames.length === 1 ? 'exchange' : 'exchanges'}`);

  const coinMarketCapEndpoint = 'https://api.coinmarketcap.com/v1/ticker/';

  leprechaun.info(`Fetching exchange rate for ${config.base.toUpperCase()}/${config.currency.toUpperCase()} from CoinMarketCap`);

  const tickers = await request({
    uri: coinMarketCapEndpoint,
    qs: {
      limit: 0,
      convert: config.base
    },
    json: true
  });

  const match = tickers.find((ticker) => {
    return ticker.symbol.toUpperCase() === config.currency.toUpperCase();
  });

  if (!match) {
    leprechaun.info(`Could not find exchange rate for ${config.base.toUpperCase()}/${config.currency.toUpperCase()} at CoinMarketCap`);
    process.exit(1);
  }

  const price = parseFloat(match[`price_${config.base.toLowerCase()}`]);
  const converted = (config.amount / price);

  leprechaun.info(`Using ${config.amount} ${config.base.toUpperCase()} as ${roundTo(converted, 8)} ${config.currency.toUpperCase()} for orders (1 ${config.currency.toUpperCase()} = ${roundTo(price, 2)} ${config.base.toUpperCase()})`);

  leprechaun.info(`Looking up top ${config.top} from CoinMarketCap`);

  const currencies = tickers.slice(0, config.top);
  const blacklist = [].concat(config.blacklist).filter(Boolean);
  const whitelist = [].concat(config.whitelist).filter(Boolean);

  try {
    await Promise.all(currencies.map(async (currency) => {
      const symbol = currency.symbol.toUpperCase();

      if (symbol === config.currency.toUpperCase()) {
        leprechaun.warning(`[${symbol}] Skipped as it is identical to the base currency`);
        return;
      }

      if (blacklist.length && blacklist.find((item) => { return String(item).toUpperCase() === symbol; })) {
        leprechaun.warning(`[${symbol}] Skipped as it is included within your blacklist`);
        return;
      }

      if (whitelist.length && whitelist.find((item) => { return String(item).toUpperCase() !== symbol; })) {
        leprechaun.warning(`[${symbol}] Skipped as it is not included within your whitelist`);
        return;
      }

      const exchange = exchanges.find((instance) => {
        return instance.markets[`${mapping[symbol] || symbol}/${config.currency.toUpperCase()}`];
      });

      if (!exchange) {
        leprechaun.warning(`[${symbol}] Skipped as it is not supported by any of your configured exchanges`);
        return Promise.resolve(); // eslint-disable-line consistent-return
      }

      const pair = exchange.markets[`${mapping[symbol] || symbol}/${config.currency.toUpperCase()}`];
      const ticker = await exchange.fetchTicker(pair.symbol);
      const pricePrecision = pair.precision ? pair.precision.price : 8;
      const amountPrecision = pair.precision ? pair.precision.amount : 8;
      const buyPrice = roundTo(ticker.bid, pricePrecision);
      const sellPrice = roundTo(ticker.ask, pricePrecision);
      const params = {};

      leprechaun.info(`[${symbol}] 1 ${symbol} = ${symbol in portfolio ? sellPrice : buyPrice} ${config.currency.toUpperCase()} at ${exchange.name} | #${currency.rank} at CoinMarketCap | Last update ${moment(currency.last_updated, 'X').fromNow()}`);

      if (exchange.id === 'kraken') {
        params.trading_agreement = 'agree';
      }

      if (symbol in portfolio) {
        const holding = portfolio[symbol];
        const coins = parseFloat(holding.amount, 10);
        const cost = parseFloat(holding.cost, 10);
        const ratio = cost > 0 ? (100 / cost * sellPrice) : 100; // eslint-disable-line no-mixed-operators
        const growth = (ratio - 100) || 0;

        leprechaun.success(`[${symbol}] ${currency.name} is already included within your portfolio (${coins} ${symbol} bought at ${roundTo(cost, pricePrecision)} ${config.currency.toUpperCase()} per ${symbol})`);

        if (sellPrice > cost && ratio >= config.threshold) {
          leprechaun.info(`[${symbol}] Intended threshold of ${config.threshold}% is reached/surpassed (actual = ${roundTo(ratio, 2)}% | growth = ${roundTo(growth, 2)}%)`);

          const remaining = roundTo(converted / sellPrice, 8);
          const sell = roundTo(coins - remaining, amountPrecision);

          try {
            leprechaun.info(`[${symbol}] Selling ${sell} ${symbol} at ${exchange.name} for ${sellPrice} ${config.currency.toUpperCase()}`);

            const order = await exchange.createLimitSellOrder(pair.symbol, sell, sellPrice, params);

            portfolio[symbol] = {
              cost: sellPrice,
              amount: remaining
            };

            fs.writeFileSync(storage, JSON.stringify(portfolio, null, 2));

            leprechaun.success(`[${symbol}] Sold ${sell} ${symbol} at ${exchange.name} (order #${order.id})`);

            return Promise.resolve(); // eslint-disable-line consistent-return
          } catch (error) {
            return Promise.reject(error); // eslint-disable-line consistent-return
          }
        } else {
          leprechaun.info(`[${symbol}] Intended threshold of ${config.threshold}% is not reached yet (actual = ${roundTo(ratio, 2)}% | growth = ${roundTo(growth, 2)}%)`);

          return Promise.resolve(); // eslint-disable-line consistent-return
        }
      } else {
        leprechaun.warning(`[${symbol}] ${currency.name} is not included within your portfolio until now`);

        const buy = roundTo(converted / buyPrice, amountPrecision);

        try {
          leprechaun.info(`[${symbol}] Buying ${buy} ${symbol} at ${exchange.name} for ${buyPrice} ${config.currency.toUpperCase()}`);

          const order = await exchange.createLimitBuyOrder(pair.symbol, buy, buyPrice, params);

          portfolio[symbol] = {
            cost: buyPrice,
            amount: buy
          };

          fs.writeFileSync(storage, JSON.stringify(portfolio, null, 2));

          leprechaun.success(`[${symbol}] Bought ${buy} ${symbol} at ${exchange.name} (order #${order.id})`);

          return Promise.resolve(); // eslint-disable-line consistent-return
        } catch (error) {
          return Promise.reject(error); // eslint-disable-line consistent-return
        }
      }
    }));
  } catch (error) {
    leprechaun.error(error);
  }
})();
