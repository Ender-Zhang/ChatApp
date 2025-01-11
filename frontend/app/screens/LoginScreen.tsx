// src/screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // 新增：导入 axios
import { UserContext } from '../contexts/UserContext'; // 导入 UserContext

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // 从 Context 中获取 setUserName
  const { setUserName } = useContext(UserContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      // 调用后端 FastAPI 登录接口
      const response = await axios.post('http://192.168.1.42:8000/login', {
        username: email,      // 后端需要的字段（示例与之前FastAPI中定义相同）
        password: password,
      });

      // 如果后端返回 200 且包含令牌等信息
      if (response.status === 200) {
        // 示例：后端返回 { access_token, user_id, username, ... }
        const data = response.data;
        // 在此保存 username 到 Context（也可保存 token 等信息）
        setUserName(data.username || email);

        // 登录成功后跳转到 Profile
        navigation.navigate('Profile');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        alert(`登录失败：${error.response.data.detail || '未知错误'}`);
      } else {
        alert(`请求错误：${error.message}`);
      }
    }

  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">登录</Text>
      <TextInput
        label="用户名或邮箱"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="密码"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        登录
      </Button>
      <Button onPress={() => navigation.navigate('Register')}>
        没有账户？注册
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default LoginScreen;