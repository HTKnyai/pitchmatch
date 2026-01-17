const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add m4a to asset extensions
config.resolver.assetExts.push("m4a");

module.exports = config;
