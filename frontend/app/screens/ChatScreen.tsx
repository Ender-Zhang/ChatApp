import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import axios from 'axios';
import CONFIG from'../../constants/config';
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

  useEffect(() => {
    console.log('页面重新加载，参数:', route.params);
    setMessages([]); // 清空旧数据
    setReloadCount((prev) => prev + 1); // 每次参数变化时增加计数
  }, [route.params?.reloadKey]);

  const sendMessage = async () => {
    if (message.trim() === '') return;  // 防止空消息

    // 用户消息
    const userMessage: Message = { id: Date.now().toString(), text: message, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]); // 更新聊天记录
    setMessage(''); // 清空输入框

    try {
      // 调用 Ollama API
      const response = await axios.post(`${CONFIG.API_BASE_URL}/chat/qwen2.5:3b`, {
        model: "qwen2.5:3b1",
        prompt: message,
      });

      // 解析返回的 response.data
      const responseData = JSON.parse(response.data.data);  // 解析嵌套的 JSON 字符串
      const botMessageText = responseData.response;  // 提取机器人的回复

      // 创建 bot 的消息
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botMessageText,
        sender: 'bot',
      };

      // 更新聊天记录
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: '抱歉，发生了错误。',
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, errorMsg]); // 发生错误时显示错误消息
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Card style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      <Text>{item.text}</Text>
    </Card>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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
