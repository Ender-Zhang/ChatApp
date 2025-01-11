import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';

interface Post {
  id: string;
  userName: string;
  text: string;
  imageUrl?: string;
  createdAt: string;
}

const MomentsScreen: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  // 模拟的假数据
  const posts: Post[] = [
    {
      id: '1',
      userName: '张三',
      text: '今天心情不错，和朋友一起去了公园，玩得很开心！',
      imageUrl: 'https://example.com/path/to/image1.jpg',
      createdAt: '2025-01-11 10:00:00',
    },
    {
      id: '2',
      userName: '李四',
      text: '下午和家人去了餐厅，吃了很多好吃的，哈哈。',
      imageUrl: 'https://example.com/path/to/image2.jpg',
      createdAt: '2025-01-11 11:00:00',
    },
    {
      id: '3',
      userName: '王五',
      text: '忙碌的一天终于结束了，期待明天有更好的开始。',
      imageUrl: '',
      createdAt: '2025-01-11 12:00:00',
    },
  ];

  const handlePost = async () => {
    if (text.trim() === '') {
      alert("请输入内容");
      return;
    }

    setUploading(true);

    // 模拟发布操作，直接清空输入框
    setText('');
    setUploading(false);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <Card style={styles.postCard}>
      <Card.Title title={item.userName} subtitle={item.createdAt} />
      <Card.Content>
        <Text>{item.text}</Text>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        ) : null}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>朋友圈</Text>
      <View style={styles.inputContainer}>
        <TextInput
          label="发布新帖"
          value={text}
          onChangeText={setText}
          style={styles.textInput}
        />
      </View>
      <Button mode="contained" onPress={handlePost} disabled={uploading} style={styles.postButton}>
        {uploading ? "发布中..." : "发布"}
      </Button>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postsContainer}
        ListEmptyComponent={<ActivityIndicator size="large" color="#6200ee" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  textInput: {
    marginBottom: 10,
  },
  postButton: {
    marginBottom: 10,
  },
  postsContainer: {
    paddingBottom: 100,
  },
  postCard: {
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
});

export default MomentsScreen;
