/** @type {import('stylelint').Config} */
export default {
  plugins: ["stylelint-declaration-strict-value"],
  ignoreFiles: ["src/index.css", "**/node_modules/**"],
  rules: {
    "scale-unlimited/declaration-strict-value": [
      [
        "/color$/",
        "background",
        "background-color",
        "box-shadow",
        "border-radius",
        "font-size",
        "backdrop-filter",
        "padding",
        "/^padding-/",
        "margin",
        "/^margin-/",
        "gap",
        "row-gap",
        "column-gap",
        "z-index",
        "transition",
        "transition-duration",
        "transition-property",
        "transition-delay",
        "transition-timing-function",
        "font-family",
        "font-weight",
      ],
      {
        ignoreValues: ["0", "auto", "100%", "1px"],
        expandShorthand: true,
        disableFix: true,
        message:
          "Use a token from the :root block in src/theme.css for ${property}. Allowed literals: 0, auto, 100%, 1px.",
      },
    ],
  },
};
