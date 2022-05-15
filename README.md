# ddns-namecheap

ddns-namecheap is a node js tool to update your namecheap Dynamic DNS record if your public ip changes. 

## Requirements

This tool has 2 requirements:
- To have node js installed
- To have the Dynamic DNS enabled for the domains we want to update. Follow the following [tutorial](https://www.namecheap.com/support/knowledgebase/article.aspx/595/11/how-do-i-enable-dynamic-dns-for-a-domain/) to set it up correctly.

## Structure

The source code has only 2 files:
- `index.js` Entrypoint of the tool.
- `config.json` The configuration we want to use for running the tool.

### The config

The `config.json` file has 2 properties:
- `lastIP`: This field exists to track the last known ip address (to avoid calling the namecheap service unless required).
- `domains`: The list of domains that point to the current server.

Each domain from the domains list should have the 3 properties:
- `name`: The root domain name we want to update the ip for.
- `password`: The namecheap Dynamic DNS password.
- `hosts`: An array with the names of each host to update for the current domain.

**If you want to update root domain use `@` as host.**

Demo config:
```
{
  "lastIP": "1.1.1.1",
  "domains": [
    {
      "name": "the-domain.com",
      "password": "the password from namecheap",
      "hosts": [
        "@",
        "subdomain"
      ]
    }
  ]
}
```

## Running the tool

To run the tool follow the following steps:
- run `npm install`
- edit the file `config.json` and add the domains.
- run `npm start`
