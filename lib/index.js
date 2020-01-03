function isHookName(s) {
  return /^(?!^(useState|useReducer|useMemo)$)(^use[A-Z0-9].*$)/.test(s);
}

function isFirstRenderingHook(node) {
  if (node.type === "Identifier") {
    return isHookName(node.name);
  } else if (
    node.type === "MemberExpression" &&
    !node.computed &&
    isFirstRenderingHook(node.property)
  ) {
    // Only consider React.useFoo() to be namespace hooks for now to avoid false positives.
    // We can expand this check later.
    const obj = node.object;
    return obj.type === "Identifier" && obj.name === "React";
  } else {
    return false;
  }
}

function matchGlobal(name) {
  return /^(window|document)$/.test(name);
}

function globalsAllowedInFunctions(name) {
  return /^(async).*/.test(name);
}

const GlobalsRule = function(context) {
  return {
    Identifier(node) {
      if (!matchGlobal(node.name)) {
        return;
      }
      if (context.getScope().type === "module") {
        context.report({
          node,
          message: "Cannot use browser globals in the module scope"
        });
      }

      if (context.getScope().type === "function") {
        const scope = context.getScope();
        const callee = scope.block.parent.callee;

        if (callee && !isFirstRenderingHook(callee)) {
          context.report({
            node,
            message: "Cannot use browser globals in hooks not useEffect"
          });
        } else if (
          scope.block.type === "FunctionDeclaration" &&
          !globalsAllowedInFunctions(scope.block.id.name)
        ) {
          context.report({
            node,
            message: "Cannot use browser globals in a Function scope"
          });
        }
      }
    }
  };
};

module.exports = {
  rules: {
    "react-global-ssr": {
      create: GlobalsRule
    }
  }
};
