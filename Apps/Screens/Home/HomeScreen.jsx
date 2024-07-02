import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../Utils/SupabaseConfig';
import { useEffect, useState } from 'react';
import VideoThumbnailItem from './VideoThumbnailItem';

export default function HomeScreen() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    user && updateProfileImage();
    // GetLatestVideoList();
    setVideoList([]);
    setLoadCount(0);
  }, [user]);

  useEffect(() => {
    GetLatestVideoList();
  }, [loadCount]);

  const updateProfileImage = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({
        profileImage: user?.imageUrl,
      })
      .eq('email', user?.primaryEmailAddress?.emailAddress)
      .is('profileImage', null)
      .select();
    if (data) {
      console.log('update profile image result data is', data);
    }
  };

  const GetLatestVideoList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,Users(username,name,profileImage)')
      .range(loadCount, loadCount + 5)
      .order('id', { ascending: false });
    if (data) {
      // console.log('Latest Video List data is', data);
      setVideoList((videoList) => [...videoList, ...data]);
    }
    if (error) {
      console.log('error is', error);
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 20, paddingTop: 15, flex: 1 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 30, fontFamily: 'NotoBold' }}>
          TikTok Clone
        </Text>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 50, height: 50, borderRadius: 99 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={videoList}
          numColumns={2}
          contentContainerStyle={{ flexGrow: 1 }}
          onRefresh={() => {
            setLoadCount(0);
            setVideoList([]);
            GetLatestVideoList();
          }}
          refreshing={loading}
          onEndReached={() => setLoadCount(loadCount + 6)}
          renderItem={({ item, index }) => (
            <View key={index + item.Users?.username} style={{ flex: 1 }}>
              <VideoThumbnailItem video={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
