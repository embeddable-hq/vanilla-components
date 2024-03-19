# Starter Components

Hello and welcome to our Embeddable components **starter pack** built just for you by the Embeddable team ❤️ We wish to thank you for using our platform and welcome any feedback you might have.

![example-dash](https://github.com/embeddable-hq/vanilla-components/assets/6795003/3f38f938-7848-4e25-8cc0-90160398f0a1)


### Installation

`npm i` # requires node 18 or later

### Build & Deploy
This is how you push code changes to your Embeddable workspace

`npm run embeddable:login`

`npm run embeddable:build`

`npm run embeddable:push`

`open https://app.embeddable.com`

### Local Development
This is a "Preview workspace" (local to you) that allows you make changes locally and see them instantly without needing to "Build and Deploy".

`npm run embeddable:login`

`npm run embeddable:dev` # opens a "Preview" workspace, that uses your local components and models

### Debugging Data Models
To test and debug your data models locally using Cube's data playground:

Create a `.env` file in the same folder as `cube-playground.yml` and follow the instructions [here](https://cube.dev/docs/product/configuration/data-sources) to add your database's credentials.

`npm run cube:playground`

open `localhost:4000`

In the playground you can:

- query for measures and dimensions
- see results
- see generated SQL
- set the Security Context to test row level security
- test pre-aggregations

Official documentation on using Cube's playground can be found [here](https://cube.dev/docs/product/workspace/playground#running-playground).


### Debugging Pre-aggregations

While cube playground is running, you can run `npm run cube:cubestore` to get access to a mysql interface on top of your locally stored preaggregations.

E.g. list the stored preaggregations using `SELECT * FROM information_schema.tables;`

Official documentation on inspecting local pre-aggregations can be found [here](https://cube.dev/docs/product/caching/using-pre-aggregations#inspecting-pre-aggregations).
