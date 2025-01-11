import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { UserContext } from '../contexts/UserContext';

// 定义帖子结构
interface Post {
  id: string;            // 为了与 React Native 的 FlatList 一致，这里把 id 转成 string
  userName: string;      // 这里与后端的 user_name 做一次映射
  text: string;          // 这里与后端的 content 做一次映射
  createdAt: string;     // 这里与后端的 created_at 做一次映射
  imageBase64?: string;  // 如果后端有 Base64 数据
  imageUrl?: string;     // 如果后端也有 image_url
}

const MomentsScreen: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

   // 从 Context 获取当前 userName
   const { userName } = useContext(UserContext);
  // 获取帖子列表
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.1.42:8000/posts');
      if (!response.ok) {
        console.error(`获取帖子失败，状态码：${response.status}`);
        return;
      }
      const data = await response.json();

      // data 应该是一个数组，我们将后端字段映射到前端定义的字段
      const fetchedPosts: Post[] = data.map((item: any) => {
        return {
          id: item.id.toString(),           // 后端返回的 id 是 number，这里转成 string
          userName: item.user_name,
          text: item.content,
          createdAt: item.created_at,
          // 如果后端返回了 image_base64，可以使用 data URI 来显示
          imageBase64: item.image_base64,   
          // 如果后端返回了 image_url，可以加上这行
          imageUrl: item.image_url,         
        };
      });

      setPosts(fetchedPosts);
    } catch (error) {
      console.error('获取帖子列表出错：', error);
    }
  };

  // 初始化时获取帖子列表
  useEffect(() => {
    fetchPosts();
  }, []);

  // 发布帖子
  const handlePost = async () => {
    if (text.trim() === '') {
      alert("请输入内容");
      return;
    }
    setUploading(true);

    try {
      // 这里演示固定 user_name，如果你有登录/用户信息，可自行从 context 或参数获取
      const payload = {
        user_name: userName,
        content: text,
        // 如果想要上传网络图片，可以给个真实 url
        image_url: 'https://example.com/path/to/image1.jpg',
      };

      const response = await fetch('http://192.168.1.42:8000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`发布帖子失败，状态码：${response.status}`);
      }

      // 发布成功后，清空输入框并重新获取帖子列表
      setText('');
      await fetchPosts();
    } catch (error) {
      console.error('发布帖子出错：', error);
    }
    setUploading(false);
  };

  // 渲染每个帖子
  const renderPost = ({ item }: { item: Post }) => (
    <Card style={styles.postCard}>
      <Card.Title title={item.userName} subtitle={item.createdAt} />
      <Card.Content>
        <Text>{item.text}</Text>
        {/* 如果有 base64 图片，可以使用 data URI 方式显示 */}
        {item.imageBase64 ? (
          <Image
            source={{ uri: `data:image/png;base64,${item.imageBase64}` }}
            style={styles.postImage}
          />
        ) : null}
        {/* 如果有 imageUrl，则可使用网络地址方式显示 */}
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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.postsContainer}
        // 如果 posts 为空，可用 ActivityIndicator 作为占位
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
    resizeMode: 'cover',
  },
});

export default MomentsScreen;
