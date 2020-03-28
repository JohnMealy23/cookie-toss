# Cookie Toss

Welcome to cookie-toss, where you can toss your cookies from domain to domain.

This package outputs...

* A script to be hosted on a central domain (the "hub domain"), where all cookies are stored.
* An module to be used in applications on other domains (or the hub domain), which retrieves cookie values stored on the hub domain.

## Overview

Cookies are the bits of data we save to a user's hard drive for later usage by our app.  Each cookie we save is scoped to the domain the user was on when the cookie was saved.  Likewise, when retrieving cookies, we're restricted to only the cookies saved to the domain our code is running on.

This is great, as it disallows a user's shopping site from reaching over to their, say, social media site, and learning all their is to know without the user's or social media site's consent.

Where this becomes painful - sometimes a site owner owns two sites and wants to let the user pass easily between them.

## API

cookie-toss has two methods exposed from its source.  One method, ``, is called to create the


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

### Deployment

