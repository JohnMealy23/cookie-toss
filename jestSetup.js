global.fetch = require('jest-fetch-mock');
global.location = {
    href: 'https://cookie-toss-test.com/'
};
process.env.VERSION = 'well.hello.there'
