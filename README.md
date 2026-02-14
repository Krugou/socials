# Project Overview

This project is a Svelte library created using [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte). It provides a set of reusable components and utilities for building Svelte applications.

## Installation Instructions

To install the project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage Examples

Here are some examples of how to use the components and utilities provided by this library:

```svelte
<script>
  import {MyComponent} from 'your-library';
</script>

<MyComponent />
```

## Contribution Guidelines

We welcome contributions from the community! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with a descriptive message.
4. Push your changes to your forked repository.
5. Create a pull request to the main repository.

## Project Dependencies

The project relies on the following dependencies:

- Svelte: ^5.0.0
- Firebase: ^11.0.2
- Lodash-es: ^4.17.21

## Troubleshooting and FAQs

### Common Issues

1. **Issue:** Development server not starting.
   **Solution:** Ensure you have installed all dependencies by running `npm install`.

2. **Issue:** Build process failing.
   **Solution:** Check the error message for details and ensure your code follows the project's guidelines.

### FAQs

1. **How do I start the development server?**
   Run `npm run dev` to start the development server.

2. **How do I build the library?**
   Run `npm run package` to build the library.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

# create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
