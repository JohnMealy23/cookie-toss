# Cookie Toss

A package that makes sharing cookies across domains a thing of ease.

This package outputs...

- A script to be hosted on a central domain (the "hub domain"), where all cookies are stored.
- An module to be used in applications on other "satellite" domains or hub domains, which retrieves and sets cookie values stored on the hub domain.

## Overview

Cookies are the bits of data we save to a user's hard drive for later usage by our application. Each cookie we save is scoped to the domain the user is on when the cookie is saved. Likewise, when retrieving cookies, we're restricted to only access cookies saved to the domain our code is running on.

This is great, as it disallows a user's shopping site from reaching over to, say, their social media site, without the consent of the user or the social media site.

Where this becomes painful - sometimes a site owner owns two sites and wants to let the user pass easily between them. If, for instance, you have a suite of education sites with different domains, and the user signs in on one, you'd rather not make them sign in again as they traverse to another. This makes for bad UX for users who want a seamless experience.

Enter cookie-toss. This package allows you to store all user data on a central (hub) domain, and set or access it from dependent (satellite) domains. It also allows you to consolidate your data retrieval logic on the central domain, so that all satellite domains need simply fetch it. This allows for a much more DRY approach.

## Usage

cookie-toss provides both code for the iframe hosted on the hub domain, as well as the data getters and setters for the satellite domains.

The minimum setup just involves deploying the iframe code with a list of white-listed satellite domains to your hub domain, and using the `get` and `set` functions in apps on the satellite domains.

### Setting and Getting Data from the Satellite Applications

Iframe on hub.com/cookie-toss.html:

```javascript
import { createIframe } from "cookie-toss";

const dependentDomains = ["satellite1.com", "satellite2.com"];
createIframe({ dependentDomains });

// That's it!
```

Somewhere in the app on satellite1.com or satellite2.com:

```javascript
import { set } from "cookie-toss";

const result = await set({
  iframeUrl: 'https://hub.com/cookie-toss.html',
  cookieName: 'chocolate-chip-oatmeal',
  data: {
      c: 'is for cookie'
  }
});
```

```javascript
import { get } from "cookie-toss";

const result = await get({
  iframeUrl: 'https://hub.com/cookie-toss.html',
  cookieName: 'chocolate-chip-oatmeal',
});

console.log(result) // { c: 'is for cookie' }
```

However, one of the strengths of cookie-toss is that it allows you to make the iframe the source of truth, alleviating potential race conditions and non-DRY.

### Iframe Handlers

```javascript
import { createIframe } from 'cookie-toss'
import { asyncCallToServerFn } from 'my-data-getter'

const dependentDomains = ['satellite1.com', 'satellite2.com']

createIframe({
    dependentDomains,
    cookieConfigs: [
        {
            cookieName: 'snickerdoodle',
            handler: asyncCallToServerFn,
            expires: Infinity
        }
    ]
});
```

In the above case, the iframe will now host our data getter, `asyncCallToServerFn`.  The value returned by this async function will be cookied at `'snickerdoodle'` in the iframe, and become available to all satellite domains.

We now can add the following to satellite1.com and satellite2.com.  The first one to call the iframe will trigger the iframe to call `asyncCallToServerFn`, and cookie its response.  In the second call, the iframe will reply immediately with the cached cookie value.

```javascript
import { get } from "cookie-toss";

const result = await get({
  iframeUrl: 'https://hub.com/cookie-toss.html',
  cookieName: 'snickerdoodle',
});

console.log(result) // Data returned by `asyncCallToServerFn` in iframe
```

## To Test

### Unit tests

WIP

### Testing

In one terminal run:

```bash
npm run dev-iframe
```

In a second terminal run:

```bash
npm run dev-app
```

Navigate to http://localhost:2222, and open the developer console to observe output.

### Build

Running `tsc` deposits built files in the `/lib` folder.
