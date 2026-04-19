const appType = process.env.APP_TYPE ?? 'teacher';
const isSchool = appType === 'school';

module.exports = {
  expo: {
    name: isSchool ? 'GH School Recruiting' : 'GH Teacher Jobs',
    slug: isSchool ? 'gh-school-recruiting' : 'gh-teacher-jobs',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: isSchool ? '#2C3E50' : '#1B4F72',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: isSchool ? 'com.ghteacher.school' : 'com.ghteacher.jobs',
      infoPlist: isSchool
        ? {
            NSPhotoLibraryUsageDescription:
              'We need photo library access to upload your school logo and documents.',
          }
        : {
            NSCameraUsageDescription:
              'We need camera access to take your profile photo and record screening videos.',
            NSMicrophoneUsageDescription:
              'We need microphone access to record your screening video.',
            NSPhotoLibraryUsageDescription:
              'We need photo library access to select files for upload.',
          },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: isSchool ? '#2C3E50' : '#1B4F72',
      },
      package: isSchool ? 'com.ghteacher.school' : 'com.ghteacher.jobs',
      permissions: isSchool
        ? ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE']
        : ['CAMERA', 'RECORD_AUDIO', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
    },
    web: {
      favicon: './assets/favicon.png',
      title: isSchool ? 'Gh_School' : 'Gh_Teacher',
    },
    plugins: isSchool
      ? ['expo-document-picker', 'expo-notifications', 'expo-secure-store']
      : [
          'expo-camera',
          'expo-document-picker',
          'expo-notifications',
          'expo-secure-store',
          ['expo-av', { microphonePermission: 'Allow GH Teacher Jobs to access your microphone.' }],
        ],
    extra: {
      apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:8080',
    },
  },
};
