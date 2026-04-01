const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for 3D assets (glb, gltf, etc.)
config.resolver.sourceExts.push('js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs');
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');

module.exports = withNativeWind(config, { input: './global.css' })