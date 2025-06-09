# Contributing

Thank you for considering contributing to this project!

## Getting started

1. Ensure [Node.js](https://nodejs.org/) 20 or later is installed.
2. Run `npm install` to install dependencies.
3. Use `npm run lint` and `npm test` to verify your changes.
4. Run `npm run build` if you modify `index.template.html` or
   `data/playthrough.json`.
5. Run `npm start` to serve the site locally on <http://localhost:8000>.

Pull requests are welcome. Please keep `index.html` in sync with
`index.template.html` and avoid duplicate `data-id` values by running
`npm test`. Commit the rebuilt `index.html` whenever the template or
playthrough data changes.
