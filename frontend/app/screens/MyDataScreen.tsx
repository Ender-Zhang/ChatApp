// src/screens/ProfileScreen.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { useLoveContext } from '../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

type ProfileScreenProps = {
  name: string;
  age: number;
  bio: string;
  tags: string[]; // 假设有一个tags属性，是一个字符串数组
};


const MyDataScreen: React.FC<ProfileScreenProps> = ({ name, age, bio, tags_ }) => {
  const displayName = name || "张三";
  const displayBio = bio || "这个人很懒，什么都没有留下";
  const tags = tags_ || ["热爱旅游","喜欢宠物"];
  const [editableName, setEditableName] = useState(displayName);
  const [editableBio, setEditableBio] = useState(displayBio);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const { lovedProfiles, removeProfileToLoved } = useLoveContext();
  const navigation = useNavigation(); // 获取导航对象

  const handleNamePress = () => {
    setIsEditingName(true);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
  };

  const handleBioPress = () => {
    setIsEditingBio(true);
  };

  const handleBioBlur = () => {
    setIsEditingBio(false);
  };

  const handleSubmit = async () => {
    // try {
    //   await setDoc(doc(db, "users", auth.currentUser?.uid || ""), {
    //     name: values.name,
    //     age: Number(values.age),
    //     // 其他字段...
    //   });
      // navigation.navigate('Chat');
      navigation.navigate('Main', {
        screen: 'Chat', // TabNavigator 中的目标选项卡
        params: { name: displayName }, // 添加随机参数
      });
    // } catch (error: any) {
    //   alert(error.message);
    // }
  };

  // 标签组件
  const renderTags = () => {
    return tags.map((tag, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{tag}</Text>
      </View>
    ));
  };

  const renderLovedProfile = (profileName: string, index: number) => {
    return (
      <View key={index} style={styles.lovedProfileRow}>
        <Avatar.Text size={40} label={profileName.charAt(0)} style={styles.avatar} />
        <Text style={styles.lovedProfileName}>{profileName}</Text>
        <Pressable onPress={() => {handleSubmit()}} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>去聊天</Text>
        </Pressable>
        <Pressable onPress={() => removeProfileToLoved(profileName)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>移除</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <Avatar.Text size={100} label={editableName.charAt(0)} style={styles.avatar} />
        <View style={styles.profileInfo}>
          {isEditingName ? (
            <TextInput
              style={styles.nameInput}
              value={editableName}
              onChangeText={setEditableName}
              onBlur={handleNameBlur}
              autoFocus
            />
          ) : (
            <Text variant="headlineMedium" onPress={handleNamePress}>
              {editableName}
            </Text>
          )}
          <Text variant="bodyMedium">年龄：{age}</Text>
          {isEditingBio ? (
            <TextInput
              style={styles.bioInput}
              value={editableBio}
              onChangeText={setEditableBio}
              onBlur={handleBioBlur}
              autoFocus
            />
          ) : (
            <Text variant="bodyMedium" onPress={handleBioPress}>
              个签：{editableBio}
            </Text>
          )}
            <View style={styles.tagsRow}>
              {renderTags()}
            </View>
        </View>
      </View>


      <Text variant="bodyMedium" style={styles.sectionHeader}>喜欢的列表：</Text>
      {lovedProfiles.map(renderLovedProfile)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  nameInput: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
  },
  bioInput: {
    width: 200,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap', // 允许标签换行
      justifyContent: 'left',
      marginTop: 20, // 在profileRow下方添加一些间距
    },
    tag: {
      backgroundColor: '#E0E0E0', // 淡灰色背景
      borderRadius: 50, // 椭圆形边框
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginHorizontal: 5,
      marginVertical: 5,
    },
    tagText: {
      color: 'black', // 标签文字颜色
    },

  sectionHeader: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
  },
  lovedProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  lovedProfileName: {
    flex: 1,
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: '#ff0000',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default MyDataScreen;
