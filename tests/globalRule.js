const globalRule = require("../lib/index");
const RuleTester = require("eslint").RuleTester;

const ruleTester = new RuleTester();

ruleTester.run(
  "react-hooks-global-ssr",
  globalRule.rules["react-hooks-global-ssr"],
  {
    valid: [
      {
        code: "function useCustomHook(){ var x = window.innerHeight;}"
      },
      {
        code: `function Comp(){ 
            useEffect(function() {
                var x = window.innerHeight;
            })
        }`
      },
      {
        code: `function Comp(){ 
            useCustomHook(function() {
                var x = window.innerHeight;
            })
        }`
      },
      {
        code: `function asyncComp(){ 
            var x = window.innerHeight;
        }`
      },
      {
        code: `function testFunc(){ 
            var x = window.innerHeight;
        }`,
        options: [{ allowFuncRegExp: /testFunc/ }]
      },

      {
        code: `function testFunc(){ 
            var x = typeof window;
        }`
      }
    ],

    invalid: [
      {
        code: "function Comp(){ var x = window.innerHeight;}",
        errors: [{ message: "Use of DOM globals is forbidden in this scope" }]
      },
      {
        code: `function Comp(){ 
            useState(function() {
                var x = window.innerHeight;
            })
        }`,
        errors: [{ message: "Use of DOM globals is forbidden in this scope" }]
      },
      {
        code: `function syncComp(){ 
            var x = window.innerHeight;
        }`,
        errors: [{ message: "Use of DOM globals is forbidden in this scope" }]
      }
    ]
  }
);
