module.exports = function(api) {
  // Caching the configuration is a performance optimization
  api.cache(true);
  
  return {
    // Babel uses 'presets' as an array of necessary transformation packages.
    // This is the standard preset for a modern React Native/Expo project.
    presets: ['babel-preset-expo'],
    
    // NOTE: If you are not using Expo, you should use:
    // presets: ['module:metro-react-native-babel-preset'],
  };
};