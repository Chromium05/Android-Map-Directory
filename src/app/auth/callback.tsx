import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Must be called on the page that receives the OAuth redirect.
// On Android Chrome Custom Tab this signals the browser to close and
// hands the result back to openAuthSessionAsync.
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallbackScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}
