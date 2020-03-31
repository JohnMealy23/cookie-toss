# Changelog

## 2.0.3 - 2020.03.31

- Added support for infinite expiry on data.
- Improved error handling in appListener.
- Fixed bug in iframeListener, which would allow erroneous calls from the app to be processed.
- Improved smoke tests.

## 2.0.2 - 2020.03.30

Improved smoke test output.

## 2.0.1 - 2020.03.30

Improved identification/security of requests sent between iframe and app

## 2.0.0 - 2020.03.30

- Removed all references to "cookie" as this is now localStorage based.
- Updated API to dis-include "cookie" references, thus the breaking change.
- Updated docs and beefed up error handling.

## 1.1.2 - 2020.03.30

Build setup wasn't properly packaging for npm.  Switched to rollup.

## 1.1.1 - 2020.03.30

Forgot to build.  Added command for deploy, to ensure build happens first.

## 1.1.0 - 2020.03.29

Switched from cookie-based storage to localStorage.

## 1.0.0 - 2020.03.28

Initial release
