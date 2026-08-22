import nextVitals from "eslint-config-next/core-web-vitals";
import boundaries from "eslint-plugin-boundaries";

export default [
  ...nextVitals,
  {
    plugins: {
      boundaries
    },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app/**" },
        { type: "widgets", pattern: "src/widgets/**" },
        { type: "features", pattern: "src/features/**" },
        { type: "entities", pattern: "src/entities/**" },
        { type: "shared", pattern: "src/shared/**" }
      ]
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          policies: [
            {
              from: { element: { type: "app" } },
              allow: [
                { to: { element: { type: "widgets" } } },
                { to: { element: { type: "features" } } },
                { to: { element: { type: "entities" } } },
                { to: { element: { type: "shared" } } }
              ]
            },
            {
              from: { element: { type: "widgets" } },
              allow: [
                { to: { element: { type: "features" } } },
                { to: { element: { type: "entities" } } },
                { to: { element: { type: "shared" } } }
              ]
            },
            {
              from: { element: { type: "features" } },
              allow: [
                { to: { element: { type: "entities" } } },
                { to: { element: { type: "shared" } } }
              ]
            },
            {
              from: { element: { type: "entities" } },
              allow: [{ to: { element: { type: "shared" } } }]
            },
            {
              from: { element: { type: "shared" } },
              allow: [{ to: { element: { type: "shared" } } }]
            }
          ]
        }
      ]
    }
  }
];
