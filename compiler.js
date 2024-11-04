/*We're just going to take our string of code and break it down into an array
* of tokens.
*
*   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]


We start by accepting an input string of code, and we're gonna set up two
*/
// import { ReadLine } from "readline";
const readline = require("readline");
//======================= THE TOKENIZER!===============================
function tokenizer(input) {
  let current = 0;
  let tokens = [];

  while (current < input.length) {
    let char = input[current];

    //Checking for Opening Parenthesis
    if (char === "(") {
      tokens.push({
        type: "paren",
        value: "(",
      });
      current++;
      continue;
    }
    //Checking for Closing Parenthesis
    if (char === ")") {
      tokens.push({
        type: "paren",
        value: ")",
      });
      current++;
      continue;
    }

    //Checking for Whitespaces
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    //Checking for Numbers
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = "";

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "Number", value });
      continue;
    }

    //Checking for Double Quotes

    if (char === '"') {
      let value = "";
      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({ type: "String", value });
      //above we are using object propety shorthand. ES6

      continue;
    }

    //Checking for Name token
    let LETTERS = /[a-z]/i;
    //i flag makes thing case-insensitive
    if (LETTERS.test(char)) {
      let value = "";

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: "Name", value });
      continue;
    }

    // Finally if we have not matched a character by now, we're going to throw an error and completely exit.

    throw new Error("I Dont know what this character is", char);
  }

  return tokens;
}

//======================= THE PARSER!======================
function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;
      return {
        type: "NumberLiteral",
        value: token.value,
      };
    }

    if (token.type === "string") {
      current++;
      return {
        type: "StringLiteral",
        value: token.value,
      };
    }

    //if it encounters opening parenthesis, it starts a CallExpression.
    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];

      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      // We increment `current` *again* to skip the name token.
      token = tokens[++current];

      while (
        token.type !== "paren" ||
        (token.type === "paren" && token.value !== ")")
      ) {
        // Here comes RECURSION into the Picture
        // while loop continues until it finds a closing parenthesis, resusively calling walk() to process each parameter and add it to the params array.
        node.params.push(walk());
        token = tokens[current];
      }

      // Finally we will increment `current` one last time to skip the closing
      // parenthesis.
      current++;

      return node;
    }
    // Again, if we haven't recognized the token type by now we're going to
    // throw an error.
    throw new TypeError(token.type);
  }

  // Now, we're going to create our AST which will have a root which is a
  // `Program` node.

  let ast = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
// ===============================The Traverser===============================
// Now we will traverse our AST using visitor pattern.
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach((child) => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverseArray(node.body, node);
        break;

      case "CallExpression":
        traverseArray(node.params, node);
        break;

      case "NumberLiteral":
      case "StringLiteral":
        break;

      default:
        throw new TypeError(node.type);
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverseNode(ast, null);
}

//===================Transformer===============================
function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.value,
        });
      },
    },
    // Next we have `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "StringLiteral",
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };
        // Next we're going to define a new context on the original
        // `CallExpression` node that will reference the `expression`'s arguments
        // so that we can push arguments.
        node._context = expression.arguments;

        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    },
  });

  return newAst;
}

// ========================  THE CODE GENERATOR!!!!==================
function codeGenerator(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGenerator).join("\n");

    case "ExpressionStatement":
      return codeGenerator(node.expression) + ";";

    case "CallExpression":
      return (
        codeGenerator(node.callee) +
        "(" +
        node.arguments.map(codeGenerator).join(", ") +
        ")"
      );

    case "Identifier":
      return node.name;

    case "NumberLiteral":
      return node.value;

    case "StringLiteral":
      return '"' + node.value + '"';

    default:
      throw new TypeError(node.type);
  }
}

// =======================Calling the functions=================
/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */
function compiler(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  return output;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter LISP Code ", (code) => {
  console.log(`You entered, ${code}!`);
  let codes = code.toString();
  console.log(compiler(codes));

  rl.close();
});
