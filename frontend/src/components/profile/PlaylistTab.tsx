import OptionsModal from '@components/OptionsModal';
import EmptyRecords from '@ui/EmptyRecords';
import PaginatedList from '@ui/PaginatedList';
import PlaylistItem from '@ui/PlaylistItem';
import {FC, useState} from 'react';
import {View, StyleSheet, Text, ScrollView, Pressable} from 'react-native';
import {useQueryClient} from 'react-query';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@types/audio';
import catchAsyncError from 'src/api/catchError';
import {fetchPlaylist, useFetchPlaylist} from 'src/hooks/query';
import {upldateNotification} from 'src/store/notification';
import {
  updateIsPlaylistPrivate,
  updatePlaylistVisbility,
  updateSelectedListId,
} from 'src/store/playlistModal';
import AntDesing from 'react-native-vector-icons/AntDesign';
import OptionSelector from '@ui/OptionSelector';
import colors from '@utils/colors';

interface Props {}

let pageNo = 0;

const PlaylistTab: FC<Props> = props => {
  const {data, isFetching} = useFetchPlaylist();
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const queryClient = useQueryClient();

  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateIsPlaylistPrivate(playlist.visibility === 'private'));
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisbility(true));
  };

  const handleOnEndReached = async () => {
    setIsFetchingMore(true);
    try {
      if (!data) return;
      pageNo += 1;
      const playlist = await fetchPlaylist(pageNo);
      if (!playlist || !playlist.length) {
        setHasMore(false);
      }

      const newList = [...data, ...playlist];
      queryClient.setQueryData(['playlist'], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    setIsFetchingMore(false);
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(['playlist']);
  };

  const handleOnLongPress = (playlist: Playlist) => {
    console.log(playlist);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {};
  const handleOnDeletePress = () => {};

  return (
    <>
      <PaginatedList
        data={data}
        hasMore={hasMore}
        isFetching={isFetchingMore}
        onEndReached={handleOnEndReached}
        onRefresh={handleOnRefresh}
        refreshing={isFetching}
        ListEmptyComponent={<EmptyRecords title="There is no playlist!" />}
        renderItem={({item, index}) => {
          return (
            <PlaylistItem
              onPress={() => handleOnListPress(item)}
              key={item.id}
              playlist={item}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        }}
      />

      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Edit',
            icon: 'edit',
            onPress: handleOnEditPress,
          },
          {
            title: 'Delete',
            icon: 'delete',
            onPress: handleOnDeletePress,
          },
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              onPress={item.onPress}
              label={item.title}
              icon={
                <AntDesing size={24} color={colors.PRIMARY} name={item.icon} />
              }
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlaylistTab;
