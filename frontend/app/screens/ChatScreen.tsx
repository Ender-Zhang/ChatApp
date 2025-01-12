import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Avatar } from 'react-native-paper';
import axios from 'axios';
import CONFIG from '../../constants/config';
import { useRoute } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const route = useRoute();
  const [reloadCount, setReloadCount] = useState(0);

  // 从路由参数中获取 name
  const name = route.params?.name || '李悦涵';

  useEffect(() => {
    console.log('页面重新加载，参数:', route.params);
    setMessages([]); // 清空旧数据
    setReloadCount((prev) => prev + 1); // 每次参数变化时增加计数
  }, [route.params?.name]);

  const sendMessage = async () => {
    if (message.trim() === '') return; // 防止空消息

    const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessage(''); // 清空输入框

    console.log("traget_name:", name)
    try {
      const response = await axios.post(`${CONFIG.API_BASE_URL}/chat/qwen2.5:3b`, {
        model: 'qwen2.5:3b1',
        target_name: name,
        prompt: message,
      });

      const responseData = JSON.parse(response.data.data);
      const botMessageText = responseData.response;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，发生了错误。',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Card style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      <Text>{item.text}</Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* 优化后的聊天对象头部 */}
      <View style={styles.header}>
        <Avatar.Text size={50} label={name.charAt(0)} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{name}</Text>
          <Text style={styles.headerStatus}>在线</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="输入消息..."
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <Button mode="contained" onPress={sendMessage}>
          发送
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  avatar: {
    backgroundColor: '#FFD700',
  },
  headerInfo: {
    marginLeft: 15,
  },
  headerName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerStatus: {
    color: '#A5D6A7',
    fontSize: 14,
  },
  messagesContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginRight: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
});

export default ChatScreen;
