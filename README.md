# Compiler

three phases
-parsing
-transformation
-code generation

- Parsing -convertint into AST
  -lexical analysis (tokenizer)
  -syntactical analysis (AST)

- Transforming the AST into meaninful/required lanugage or same.
- Code genration generating code and printing to the console.

Tokenizer:

A tokenizer (also known as a lexical analyzer) scans the source code and breaks it down into meaningful sequences called tokens. Each token represents a basic element of the language, like keywords, operators, identifiers, literals, and punctuation marks.

1. Lexical Analysis: The tokenizer reads the input code character by character.

2. Token Identification: It recognizes sequences of characters that form valid tokens according to the language's grammar rules.

3. Token Generation: It generates tokens for each identified sequence, often tagging them with type information and, sometimes, line numbers for debugging purposes.

These tokens are then passed to the parser for syntactic analysis, which checks if the tokens follow the language's syntax rules and builds a structure (often an Abstract Syntax Tree or AST) representing the code.

==========================Parser=================

The parser takes the stream of tokens produced by the tokenizer and analyzes their grammatical structure according to the syntax rules of the programming language. Essentially, it checks if the sequence of tokens forms a valid statement or expression.

1. Syntactic Analysis: The parser reads tokens sequentially and verifies if they conform to the language's syntax (like checking for correct use of parentheses, keywords, and so on).

2. Syntax Tree Construction: It builds a parse tree (or abstract syntax tree, AST) that represents the hierarchical syntactic structure of the source code. Each node in the tree corresponds to a construct occurring in the source code.

3. Error Detection: If the tokens don't match the syntax rules, the parser generates error messages, indicating where and what kind of syntax error is found.

The parse tree or AST is then used for further stages of compilation like semantic analysis, optimization, and code generation.

===================
Traverser function is used to traverse the AST
The traverser function accepts two arguments:

ast: The root of the AST, which represents the structure of code as a tree.
visitor: An object that contains functions that can be called at each node in the AST, based on the node's type.

The `traverser` function walks through an AST (Abstract Syntax Tree) recursively, visiting each node and allowing custom actions (defined in a `visitor` object) to be performed on each node type.

In short:

- It takes an AST and a `visitor` object as input.
- For each node, it:
  - Calls an `enter` function if provided in the visitor, allowing specific actions to run when entering that node.
  - Recursively processes child nodes if they exist.
  - Calls an `exit` function if provided, allowing actions to run when leaving that node.

This setup makes it easy to apply specific operations or transformations to different parts of the AST in a structured way.
