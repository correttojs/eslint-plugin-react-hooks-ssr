const MESSAGE = "Use of DOM globals is forbidden in this scope";

function isHookAllowed(node) {
  if (node.type === "Identifier") {
    return /^(?!^(useState|useReducer|useMemo)$)(^use[A-Z0-9].*$)/.test(
      node.name
    );
  } else if (
    node.type === "MemberExpression" &&
    !node.computed &&
    isHookAllowed(node.property)
  ) {
    // Only consider React.useFoo() to be namespace hooks for now to avoid false positives.
    // We can expand this check later.
    const obj = node.object;
    return obj.type === "Identifier" && obj.name === "React";
  } else {
    return false;
  }
}

function isHookOrFuncForbidden(node, funcRegExp) {
  return !isHookAllowed(node) && !funcRegExp.test(node.name);
}

function matchGlobal(name) {
  return /^(window|document)$/.test(name);
}

const GlobalsRule = function(context) {
  let funcRegExp = /^(async).*/;
  context.options.forEach(option => {
    if (typeof option === "object" && option.allowFuncRegExp)
      funcRegExp = option.allowFuncRegExp;
  });
  return {
    Identifier(node) {
      if (!matchGlobal(node.name)) {
        return;
      }
      if (context.getScope().type === "module") {
        context.report({
          node,
          message: MESSAGE
        });
      }

      if (context.getScope().type === "function") {
        const scope = context.getScope();

        // case FunctionDeclaration
        if (
          scope.block.type === "FunctionDeclaration" &&
          isHookOrFuncForbidden(scope.block.id, funcRegExp)
        ) {
          context.report({ node, message: MESSAGE });
          return;
        }

        const parent = scope.block.parent;
        if (!parent) {
          return;
        }

        // case VariableDeclarator
        if (
          parent.type === "VariableDeclarator" &&
          isHookOrFuncForbidden(parent.id, funcRegExp)
        ) {
          context.report({ node, message: MESSAGE });
          return;
        }

        // case ExportDefaultDeclaration
        if (parent.type === "ExportDefaultDeclaration") {
          context.report({ node, message: MESSAGE });
          return;
        }

        // case callee
        if (parent.callee && isHookOrFuncForbidden(parent.callee, funcRegExp)) {
          context.report({ node, message: MESSAGE });
          return;
        }
      }
    }
  };
};

module.exports = {
  rules: {
    "react-hooks-global-ssr": {
      create: GlobalsRule
    }
  }
};
