import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Icon } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLoveContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
// 如果不使用Expo，则需要这样引入：
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ProfileScreenProps = {
  name: string;
  age: number;
  bio: string;
  tags: string[];
  isLove: boolean;
  image?: any;
};

const ProfileCard: React.FC<ProfileScreenProps> = ({ name, age, bio, tags, isLove, image, }) => {
  const [loveState, setLoveState] = useState(isLove);
  const displayName = name || "张三";
  const displayBio = bio || "这个人很懒，什么都没有留下";
  const displayTags = tags || ["热爱旅游", "喜欢宠物"];
  const { addProfileToLoved, removeProfileToLoved } = useLoveContext();
  const navigation = useNavigation(); // 获取导航对象
  const toggleLove = () => {
    setLoveState(!loveState);
    if (!loveState) {
      addProfileToLoved(name);
    } else {
      removeProfileToLoved(name);
    }
  };

  const renderTags = () => {
    return displayTags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };
  const handleSubmit = async () => {
    // try {
    //   await setDoc(doc(db, "users", auth.currentUser?.uid || ""), {
    //     name: values.name,
    //     age: Number(values.age),
    //     // 其他字段...
    //   });
    navigation.navigate('Main', {
      screen: 'Chat', // TabNavigator 中的目标选项卡
      params: { name: displayName }, // 添加随机参数
    });
    // } catch (error: any) {
    //   alert(error.message);
    // }
  };

  const heartIconName = loveState ? 'heart' : 'heart-outline';

  return (
    <View style={styles.profileRow}>
      <Avatar.Image
        size={100}
        source={
          image
        }
        style={styles.avatar}
      />
      <View style={styles.profileInfo}>
        <Text variant="headlineMedium">{displayName}</Text>
        <Text variant="bodyMedium">年龄：{age}</Text>
        <Text variant="bodyMedium">个性签名：{displayBio}</Text>
        <View style={styles.tagsRow}>
          {renderTags()}
        </View>
      </View>
            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              聊天
            </Button>
      <MaterialCommunityIcons
        name={heartIconName}
        size={24}
        color={loveState ? 'red' : 'gray'}
        style={styles.heartIcon}
        onPress={toggleLove}
      />
    </View>
  );
};

const FindLoverScreen: React.FC<{ profiles_: ProfileScreenProps_[] }> = ({ profiles_ }) => {
    const profiles = profiles_ || [
      {
        name: "Ai红娘",
        age: 18,
        bio: "你的专属ai红娘",
        tags: ["帮你找到意中人"],
        isLove: false,
        image: require('../../assets/images/redwoman.png'),
      },
      {
        name: "Alice",
        age: 28,
        bio: "爱旅行，爱摄影，爱生活。",
        tags: ["旅行", "摄影", "美食"],
        isLove: false,
        image: require('../../assets/images/Alice.png'),
      },
      {
        name: "Bob",
        age: 32,
        bio: "健身达人，喜欢挑战自我。",
        tags: ["健身", "跑步", "爬山"],
        isLove: false,
        image: require('../../assets/images/Bob.png'),
      },
      {
        name: "Charlie",
        age: 24,
        bio: "音乐是我的灵魂，吉他弹唱是我的激情。",
        tags: ["音乐", "吉他", "唱歌"],
        isLove: false,
        image: require('../../assets/images/Charlie.png'),
      },
      {
        name: "Diana",
        age: 29,
        bio: "书和咖啡，我的完美下午。",
        tags: ["阅读", "咖啡", "写作"],
        isLove: false,
        image: require('../../assets/images/Diana.png'),
      },
      {
        name: "Evan",
        age: 35,
        bio: "编程让我快乐，解决问题让我兴奋。",
        tags: ["编程", "技术", "解决问题"],
        isLove: false,
        image: require('../../assets/images/Evan.png'),
      }
    ];
  return (
    <ScrollView style={styles.container}>
      {profiles.map((profile, index) => (
        <ProfileCard key={index} {...profile} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },

  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  heartIcon: {
    marginLeft: 'auto', // 将爱心推到最右边
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
    marginTop: 20,
  },
  tag: {
    backgroundColor: '#E0E0E0',
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  tagText: {
    color: 'black',
  },
});

export default FindLoverScreen;