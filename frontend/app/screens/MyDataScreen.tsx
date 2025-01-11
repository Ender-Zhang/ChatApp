// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

type ProfileScreenProps = {
  name: string;
  age: number;
  bio: string;
};

const MyDataScreen: React.FC<ProfileScreenProps> = ({ name, age, bio }) => {
  const displayName = name || "张三";
  const displayBio = bio || "这个人很懒，什么都没有留下";

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <Avatar.Text size={100} label={displayName.charAt(0)} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text variant="headlineMedium">{displayName}</Text>
          <Text variant="bodyMedium">年龄：{age}</Text>
          <Text variant="bodyMedium">个签：{displayBio}</Text>
        </View>
      </View>
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
    flexDirection: 'row', // 设置为行布局
    alignItems: 'center', // 垂直居中对齐
  },
  avatar: {
    marginRight: 20, // 在头像和文本之间添加间距
  },
  profileInfo: {
    justifyContent: 'center', // 垂直居中对齐文本
  },
});

export default MyDataScreen;
