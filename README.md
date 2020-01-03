# eslint-plugin-react-ssr

This plugin helps you to forbid DOM globals within the react server side rendering.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-react-ssr`:

```
$ npm install eslint-plugin-react-ssr --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-react-ssr` globally.

## Usage

Add `react-ssr` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "react-ssr"
    ]
}
```


