# Embeddable.com Starter Pack

Hello and welcome to our Embeddable components **starter pack** built just for you by the Embeddable team ❤️ We wish to thank you for using our platform and welcome any feedback.

![example-dash](https://github.com/embeddable-hq/vanilla-components/assets/6795003/3f38f938-7848-4e25-8cc0-90160398f0a1)


### Installation

`npm i` # requires node 20 or later

### Build & Deploy
This is how you push code changes to your Embeddable workspace

 1. Head to https://app.us.embeddable.com (or https://app.eu.embeddable.com) and grab your **API Key**.

 2. **Set your location**: in [embeddable.config.ts](./embeddable.config.ts), uncomment either the US or EU config section.

 3. **Build** the code bundle: `npm run embeddable:build`

 4. **Push** the above code bundle to your workspace:
 
   `npm run embeddable:push -- --api-key <API Key> --email <Email> --message <Message>`

 4. Head back to https://app.embeddable.com (or https://app.eu.embeddable.com) and "Create new Embeddable" using the **components** and **models** from your code bundle

### Local Development
This is a "Preview workspace" (local to you) that allows you make changes locally and see them instantly without needing to "Build and Deploy".

`npm run embeddable:dev` (note: you may need to run `npm run embeddable:login` first)

It opens a "Preview" workspace, that uses your local components and models.

### Syncing this starter pack with your private repo

We recommend cloning this repo and storing it privately where you keep your git repositories.

You can then set up this repo as a [git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) so that you can merge in the latest changes (new components, functionality, etc.) whenever you need.

Alternatively, if you'd prefer to integrate Embeddable's sdk directly into your existing codebase, take a look at [this repo](https://github.com/embeddable-hq/onboarding) for an example of a minimal setup.

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

## Environment variables

Environment variables can be set in a `.env` file in the root of the project. The following variables are available:

| Variable name       | Type                     | Default Value | Description                  |
|---------------------|--------------------------|---------------|------------------------------|
| CUBE_CLOUD_ENDPOINT | Cube Cloud Configuration |               | URL to connect to cube cloud |
