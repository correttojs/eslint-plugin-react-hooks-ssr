# eslint-plugin-react-ssr

This plugin helps you to forbid DOM globals within the react server side rendering. 
- it doesn't support yet React classes
- it supports custom hooks
- it requires some naming conventions to identify other functions where globals may be allowed


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

## Documentation

- a global within `useEffect` is allowed 

```javascript
function Component() {
    useEffect(() => {
        console.log(window.innerWidth);
    });
    return <div>Hello</div>;
}
```

- a global within a custom hook (`useXXX`) is allowed 

```javascript
function Component() {
    useCustomHook(() => {
        console.log(window.innerWidth);
    });
    return <div>Hello</div>;
}
```


- a global within a function prefixed by `async` (`asyncMyFunc`) is allowed

```javascript
function asyncMyFunction() {
  console.log(window.innerWidth);
}
```

- a global within a `useState` and `useReducer` callback is forbidden

```javascript
function Component() {
    const [myState, setMyState] = useState(() => {
        return window.innerWidth
    });
    return <div>Hello</div>;
}
```

- a global within a React `Component` is forbidden

```javascript
function Component() {
    console.log(window.innerWidth)
    return <div>Hello</div>;
}
```