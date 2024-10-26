/*We're just going to take our string of code and break it down into an array
 * of tokens.
 *
 *   (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 

We start by accepting an input string of code, and we're gonna set up two
*/

//======================= THE TOKENIZER!======================
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
function parser(tokens) {}
