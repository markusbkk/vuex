# Application Structure

Vuex doesn't really restrict how you structure your code. Rather, it enforces a set of high-level principles:

1. Application-level state is centralized in the store.

2. The only way to mutate the state is by committing **mutations**, which are synchronous transactions.

3. Asynchronous logic should be encapsulated in, and can be composed with **actions**.

As long as you follow these rules, it's up to you how to structure your project. If your store file gets too big, simply start splitting the actions, mutations and getters into separate files.

For any non-trivial app, we will likely need to leverage modules. Here's an example project structure:

```bash
├── index.html
├── App.tsx
├── api
│   └── ... # abstractions for making API requests
├── components
│   ├── MyComponent.tsx
│   └── ...
└── store
    ├── index.ts          # where we assemble modules and export the store
    ├── actions.ts        # root actions
    ├── mutations.ts      # root mutations
    └── modules
        ├── cart.ts       # cart module
        └── products.ts   # products module
```

[Back](index.md)