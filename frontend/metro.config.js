const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for Expo web (Metro bundler)
  isCSSEnabled: true,
});

module.exports = config;
