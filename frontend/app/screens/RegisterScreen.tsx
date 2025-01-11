// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // 新增：导入 axios

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    try {
      // 调用后端 FastAPI 注册接口
      // 假设后端需要 { username, password }
      const response = await axios.post('http://192.168.1.42:8000/register', {
        username: email,
        password: password,
      });

      if (response.status === 200 || response.status === 201) {
        // 注册成功后，跳转到登录页或者直接登录
        // 这里演示跳转到登录页
        alert('注册成功，请登录！');
        navigation.navigate('Login');
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        alert(`注册失败：${error.response.data.detail || '未知错误'}`);
      } else {
        alert(`请求错误：${error.message}`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">注册</Text>
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
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        注册
      </Button>
      <Button onPress={() => navigation.goBack()}>
        已有账户？登录
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

export default RegisterScreen;
