const fs = require('fs');
const axios = require('axios');
const config = require('./config');

let ipUpdated = false;

function extractIp(res) {
    return Promise.resolve(res.data);
}

function updateDns(ip) {
    if (ip === config.lastIP) {
        return Promise.resolve();
    }
    ipUpdated = true;
    config.lastIP = ip;
    const promises = config.domains.reduce(function (res, domain) {
        domain.hosts.forEach(function(host) {
            const url = [
                'https://dynamicdns.park-your-domain.com/update?',
                `host=${host}`,
                `domain=${domain.name}`,
                `password=${domain.password}`,
                `ip=${ip}`
            ].join('');
            res.push(axios.get(url));
        });
        return res;
    }, []);
    return Promise.all(promises);
}

function fsCallback (err) {
    if (err) throw err;
}

function writeLog(msg) {
    fs.appendFile(
        'logs.txt',
        `${new Date().toLocaleString()} ${msg}\n`,
        fsCallback,
    );
}

function handleSuccess() {
    fs.writeFile('config.json', JSON.stringify(config, null, 2), fsCallback);
    const updateMsg = ipUpdated
        ? `ip changed to ${config.lastIP}`
        : 'no update required';
    writeLog(`Successful run: ${updateMsg}`);
}

function handleError(e) {
    writeLog(`Error running updater: ${e.message}`);
}

axios
    .get('http://api.ipify.org')
    .then(extractIp)
    .then(updateDns)
    .then(handleSuccess)
    .catch(handleError);