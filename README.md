# github-actions-ccxml

Generate cc.xml from GitHub Actions

This project was bootstrapped with [TSPx](https://github.com/joeflateau/tspx).

## Get Started

- Add this url: ([https://xw8itiorz6.execute-api.us-east-1.amazonaws.com/prod/github/actions-cheat-sheet/cc.xml?personalAccessToken=](https://xw8itiorz6.execute-api.us-east-1.amazonaws.com/prod/github/actions-cheat-sheet/cc.xml?personalAccessToken=)) to your CC client (I like [http://ccmenu.org/](http://ccmenu.org/)) and you'll get build status updates while the GitHub actions run.
- `src/lambda/handler.ts` is the entry point for this function
- `src/index.ts` has the implementation of loading status from GitHub and transforming to cc.xml format
- For private repos, generate a personal access token and pass that in the `personalAccessToken` query parameter.
  - ie: [https://xw8itiorz6.execute-api.us-east-1.amazonaws.com/prod/github/actions-cheat-sheet/cc.xml?personalAccessToken=abc123](https://xw8itiorz6.execute-api.us-east-1.amazonaws.com/prod/github/actions-cheat-sheet/cc.xml?personalAccessToken=abc123)

## Development

### `npm run test`

This will run the test suite. Tests are colocated with code and named `*.spec.ts`.

### `npm publish`

This is how you publish to npm. This project has a `prepare` script that compiles the `.ts` to `.js` and `.d.ts`. It also has a `prepublishOnly` script that runs the test suite. Npm will call these scripts automatically as part of the publishing flow so you can be sure you are always publishing the compiled, tested package.

### `npm run prepare` or `npm run build`

You should not need to run these manually, the `prepare`/`prepublishOnly` scripts when you publish should be enough, but if you find it necessary, these are here for you.
