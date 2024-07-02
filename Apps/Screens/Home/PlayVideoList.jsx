import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import PlayVideoListItem from './PlayVideoListItem';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../Utils/SupabaseConfig';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function PlayVideoList() {
  const params = useRoute().params;
  const [videoList, setVideoList] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const BottomTabHeight = useBottomTabBarHeight();
  const ScreenHeight = Dimensions.get('window').height - BottomTabHeight;

  useEffect(() => {
    setVideoList([params.selectedVideo]);
    GetLatestVideoList();
  }, []);

  const GetLatestVideoList = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('PostList')
      .select('*,Users(username,name,profileImage)')
      .range(0, 7)
      .order('id', { ascending: false });
    const result = data.filter((item) => item.id !== params.selectedVideo.id);
    setVideoList((videoList) => [...videoList, ...result]);

    if (error) {
      console.log('error is', error);
    }
    setLoading(false);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          zIndex: 20,
          padding: 20,
          paddingTop: 50,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <FlatList
        data={videoList}
        pagingEnabled
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.y / ScreenHeight
          );
          setCurrentVideoIndex(index);
        }}
        style={{ zIndex: -1 }}
        renderItem={({ item, index }) => (
          <PlayVideoListItem
            key={index}
            video={item}
            index={index}
            activeIndex={currentVideoIndex}
          />
        )}
      />
    </View>
  );
}
