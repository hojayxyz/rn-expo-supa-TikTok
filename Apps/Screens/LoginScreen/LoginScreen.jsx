import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useCallback, useRef, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import Colors from '../../Utils/Colors';
import { supabase } from '../../Utils/SupabaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        if (signUp?.emailAddress) {
          const { data, error } = await supabase
            .from('Users')
            .insert([
              {
                name: signUp?.firstName,
                email: signUp?.emailAddress,
                username: (signUp?.emailAddress).split('@')[0],
              },
            ])
            .select();
          if (data) {
            console.log('data is', data);
          }
        }
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Video
        style={styles.video}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        shouldPlay
        isMuted
      />
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: 100,
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: Colors.BACKGROUND_TRANSPARENT,
        }}
      >
        <Text
          style={{ fontFamily: 'NotoBold', color: Colors.WHITE, fontSize: 35 }}
        >
          Taka Tok
        </Text>
        <Text
          style={{
            fontFamily: 'NotoRegular',
            color: Colors.WHITE,
            fontSize: 17,
            textAlign: 'center',
            marginTop: 15,
          }}
        >
          Ultimate place to share short videos with community
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexDirection: 'row',
            backgroundColor: Colors.WHITE,
            padding: 10,
            paddingHorizontal: 25,
            borderRadius: 99,
            position: 'absolute',
            bottom: 150,
          }}
        >
          <Image
            source={require('../../../assets/images/google.png')}
            style={{ width: 30, height: 30 }}
          />
          <Text style={{ fontFamily: 'NotoMedium' }}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});
