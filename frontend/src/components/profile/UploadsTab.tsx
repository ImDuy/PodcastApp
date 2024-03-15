import OptionsModal from '@components/OptionsModal';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AudioListItem from '@ui/AudioListItem';
import AudioListLoadingUI from '@ui/AudioListLoadingUI';
import EmptyRecords from '@ui/EmptyRecords';
import OptionSelector from '@ui/OptionSelector';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AntDesing from 'react-native-vector-icons/AntDesign';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {AudioData} from 'src/@types/audio';
import {ProfileNavigatorStackParamList} from 'src/@types/navigation';
import {useFetchUploadsByProfile} from 'src/hooks/query';
import useAudioController from 'src/hooks/useAudioController';
import {getPlayerState} from 'src/store/player';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<AudioData>();
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading, isFetching} = useFetchUploadsByProfile();
  const queryClient = useQueryClient();
  const {onAudioPress} = useAudioController();
  const {navigate} =
    useNavigation<NavigationProp<ProfileNavigatorStackParamList>>();
  const noData = !data?.length;

  const handleOnLongPress = (audio: AudioData) => {
    setSelectedAudio(audio);
    setShowOptions(true);
  };

  const handleOnEditPress = () => {
    setShowOptions(false);
    if (selectedAudio)
      navigate('UpdateAudio', {
        audio: selectedAudio,
      });
  };

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
  };

  if (isLoading) return <AudioListLoadingUI />;

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {noData ? <EmptyRecords title="There is no audio!" /> : null}
        {data?.map(item => {
          return (
            <AudioListItem
              onPress={() => onAudioPress(item, data)}
              key={item.id}
              audio={item}
              isPlaying={onGoingAudio?.id === item.id}
              onLongPress={() => handleOnLongPress(item)}
            />
          );
        })}
      </ScrollView>
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
        ]}
        renderItem={item => {
          return (
            <OptionSelector
              icon={
                <AntDesing size={24} color={colors.PRIMARY} name={item.icon} />
              }
              label={item.title}
              onPress={item.onPress}
            />
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLabel: {color: colors.PRIMARY, fontSize: 16, marginLeft: 5},
});

export default UploadsTab;
