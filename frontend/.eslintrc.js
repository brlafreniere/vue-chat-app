module.exports = {
    extends: ["vue", "standard", "plugin:vue/recommended", "plugin:vue/essential"],
    plugins: ["vue", "import"],
    rules: {
        indent: ["error", 4],
		"vue/html-indent": ["error", 4, {
			"attribute": 1,
			"baseIndent": 1,
			"closeBracket": 0,
			"alignAttributesVertically": true,
			"ignores": []
		}],
        "vue/name-property-casing": ["error", "PascalCase"]
    }
};
