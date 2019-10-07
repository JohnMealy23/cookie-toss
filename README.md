# Cookie Swap

This module has two outputs: 

* iframe HTML 
    * Published into S3
    * Hosted by main site, which will host all cookies (ex: host.com)
* front-end getter module
    * imported by dependent sites (ex: dependent.com)
    * to be published to npm registry

## Iframe HTML hosted on main site

* Has a list of whitelisted origins (ex: 'dependent.com')
* Injected by dependent sites
* Listens for post requests from dependent sites
* Checks origin of post requests to ensure requester is on the dependent whitelist
* If request origin is whitelisted, gets requested data, and posts a request to parent window, containing cookie contents
