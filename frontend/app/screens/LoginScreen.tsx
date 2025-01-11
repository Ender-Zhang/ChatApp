// src/screens/LoginScreen.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext'; // 导入 UserContext

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // 从 Context 中获取 setUserName
  const { setUserName } = useContext(UserContext);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // 这里是你原本的登录逻辑，比如：
    // signInWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     // 登录成功，保存用户名（这里用 email 演示，如果后端返回了用户名，你可以换成后端返回的 username）
    //     setUserName(email);

    //     // 跳转到 Profile
    //     navigation.navigate('Profile');
    //   })
    //   .catch(error => {
    //     alert(error.message);
    //   });

    // 这里简化演示，假设登录成功：
//     setUserName(email);
//     navigation.navigate('Profile');

  navigation.navigate('MyData', {
    name: '张三', // 假设这是登录用户的名字
    age: 25, // 假设这是登录用户的年龄
    bio: '热爱编程，追求技术', // 假设这是登录用户的个签
  });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">登录</Text>
      <TextInput
        label="电子邮件"
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
