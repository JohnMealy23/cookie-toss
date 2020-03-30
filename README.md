# Cookie Toss

A package that makes sharing local data across domains a thing of ease.

This package outputs...

- A script to be hosted on a central domain, the "hub domain", where all user data is stored.
- A module to be used in applications on "satellite" domains, which retrieves and sets localStorage values on the hub domain.

---

### A Note on the Name

Yes, yes - it's called "Cookie Toss", but it uses localStorage.  In the first iteration, cookies were used, but due to current and upcoming changes to browser cookie policies, not to mention larger hard drive allowances for LS, it made more sense to move it to be localStorage based.

Cookie Toss it will remain, though.

---

## Overview

localStorage values are the pieces of data we save to a user's hard drive for later usage by our application. Each value we save is scoped to the domain the user is on when the save takes place. Likewise, when retrieving the values, we're restricted to only access those values saved to the domain our code is running on.

This is great, as it disallows a user's shopping site from grabbing data from, say, their social media site, without the consent of the user or the social media site.

Where this becomes painful - sometimes a site owner owns two sites and wants to let the user pass easily between them with all of their saved data. If, for instance, you have a suite of sites with different domains and the user signs in on one, you'd rather not make them sign in again as they traverse to another. This makes for bad UX for users who want a seamless experience.

Enter cookie-toss. This package allows you to store all user data on a central (hub) domain, and set or access it from dependent (satellite) domains. It also allows you to consolidate your data retrieval logic on the central domain, so that all satellite domains need simply fetch it. This allows for a much more DRY approach.

## Usage

---

__Note__: You can find full examples of usage in the /examples directory of the repo.

---

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
  // This is the URL at which you've hosted the output of `createIframe`, above:
  iframeUrl: 'https://hub.com/cookie-toss.html',
  dataKey: 'chocolate-chip-oatmeal',
  data: {
      c: 'is for localStorage',
      and: 'that\'s good enough for me.'
  }
});
```

```javascript
import { get } from "cookie-toss";

const result = await get({
  iframeUrl: 'https://hub.com/cookie-toss.html',
  dataKey: 'chocolate-chip-oatmeal',
});

console.log(result)
/* Logs:
{
    c: 'is for localStorage',
    and: 'that\'s good enough for me.'
}
*/
```

However, one of the strengths of cookie-toss is that it allows you to make the iframe the source of truth, alleviating potential race conditions and non-DRY behavior in your satellite apps.  This is done by using handlers in the iframe to do the cookie fetching.  Read on.

### Iframe Handlers

```javascript
import { createIframe } from 'cookie-toss'
import { myFetchFromServerFn } from 'my-data-getter'

const dependentDomains = ['satellite1.com', 'satellite2.com']

createIframe({
    dependentDomains,
    dataConfigs: [
        {
            dataKey: 'snickerdoodle',
            handler: myFetchFromServerFn,
            expires: 3
        }
    ]
});
```

In the above case, the iframe will now host our data getter, `myFetchFromServerFn`.  The value returned by this async function will be stored at the `'snickerdoodle'` key in the iframe, and become available to all satellite domains.

We now can add the following code to satellite1.com and satellite2.com.  The first satellite to call the iframe will trigger the iframe to call `myFetchFromServerFn` and cache the response on the hub.  In the second call, the iframe will reply immediately with the cached value.

```javascript
import { get } from "cookie-toss";

const result = await get({
  iframeUrl: 'https://hub.com/cookie-toss.html',
  dataKey: 'snickerdoodle',
});

console.log(result) // Data returned by `myFetchFromServerFn` in iframe
```

## API

### `createIframe(options)`

The function for producing the code that lives in the iframe on the hub domain.

`options` parameters:

| option | description | required | type | example |
|-|-|-|-|-|
| `dependentDomains` | An array of the domains allowed to access data on the hub domain. Do not include protocols or paths. | `true` | Array | `[ 'example.com' ]` |
| `dataConfigs` | An array of configurations for each data value the iframe will manage. | `false` | Array | See below. |
| `dataConfigs[n].dataKey` | The localStorage key the data will be stored under. Also used when retrieving the value. | `true` | String | `'snickerdoodle'` |
| `dataConfigs[n].handler` | The function that retrieves the data for the localStorage value. Optionally receives an argument the app sends when requesting the datum. | `true` | Function | ``(userName) => axios(`${myEndpoint}?user=${userName}`)`` |
| `dataConfigs[n].expires` | The number of days before the data expires. | `false` | Number | `7` |

### `set(options)`

The function used by the application for setting the localStorage value on the hub domain.

It is not necessary to use `set` if the value has a `dataConfig` configured in the `createIframe` function on the hub. In this case, the iframe becomes the setter.

`options` parameters:

| option | description | required | type | example |
|-|-|-|-|-|
| `iframeUrl` | The full URL on the hub domain where the iframe lives. | `true` | String | https://my-hub-domain.com |
| `dataKey` | The localStorage key the data will be stored on under the hub domain. | `true` | String | `'samoa'` |
| `data` | The value to be stored. | `true` | Any primitive or stringify-able value. | `{ c: 'is for cookie' }` |

### `get(options)`

The function used by the application for getting the datum from the hub domain.  Must reference a `dataKey` previously set by the `set` function, or configuring in an iframe `dataConfigs` object.

`options` parameters:

| option | description | required | type | example |
|-|-|-|-|-|
| `iframeUrl` | The full URL on the hub domain where the iframe lives. | `true` | String | https://my-hub-domain.com |
| `dataKey` | The name under which the datum is stored on the hub domain. | `true` | String | `'samoa'` |
| `handlerPayload` | The value that the iframe's `dataConfig`'s handler will receive.  Only applicable to `dataKey`s with `dataConfig` objects passed into the `createIframe` function on the hub domain. | `false` | Any primitive or stringify-able value. | `{ userType: 'B' }` |
| `resetData` | If `true`, will purge the data, forcing the iframe's handler to re-retrieve the data value.  Only applicable to `dataKey`s with `dataConfig` objects passed into the `createIframe` function on the hub domain. | `false` | Boolean | `true` |

## To Test

### Unit tests

[TBD]

### Smoke Tests

Add the following entries to your etc/hosts file:
```
127.0.0.1	dependant-site.com
127.0.0.1	source-of-truth.com
```

In one terminal run:

```bash
npm run dev-iframe
```

In a second terminal run:

```bash
npm run dev-app
```

Navigate to http://dependant-site.com:2222, and open the developer console to observe output.

### Build

Running `tsc` deposits built files in the `/lib` folder.
