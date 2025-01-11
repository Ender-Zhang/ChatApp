// // src/screens/LoginScreen.tsx
// import React, { useState, useContext } from 'react';
// import { View, StyleSheet } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/AppNavigator';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios'; // 新增：导入 axios
// import { UserContext } from '../contexts/UserContext'; // 导入 UserContext

// type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// const LoginScreen: React.FC = () => {
//   const navigation = useNavigation<LoginScreenNavigationProp>();

//   // 从 Context 中获取 setUserName
//   const { setUserName } = useContext(UserContext);

//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');

//   const handleLogin = async () => {
//     try {
//       // 调用后端 FastAPI 登录接口
//       const response = await axios.post('http://192.168.1.42:8000/login', {
//         username: email,      // 后端需要的字段（示例与之前FastAPI中定义相同）
//         password: password,
//       });

//       // 如果后端返回 200 且包含令牌等信息
//       if (response.status === 200) {
//         // 示例：后端返回 { access_token, user_id, username, ... }
//         const data = response.data;
//         // 在此保存 username 到 Context（也可保存 token 等信息）
//         setUserName(data.username || email);

//         // 登录成功后跳转到 Profile
//         navigation.navigate('Profile');
//       }
//     } catch (error: any) {
//       console.log(error);
//       if (error.response) {
//         alert(`登录失败：${error.response.data.detail || '未知错误'}`);
//       } else {
//         alert(`请求错误：${error.message}`);
//       }
//     }

//   };

//   return (
//     <View style={styles.container}>
//       <Text variant="headlineMedium">登录</Text>
//       <TextInput
//         label="用户名或邮箱"
//         value={email}
//         onChangeText={setEmail}
//         style={styles.input}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         label="密码"
//         value={password}
//         onChangeText={setPassword}
//         style={styles.input}
//         secureTextEntry
//       />
//       <Button mode="contained" onPress={handleLogin} style={styles.button}>
//         登录
//       </Button>
//       <Button onPress={() => navigation.navigate('Register')}>
//         没有账户？注册
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   input: {
//     marginVertical: 10,
//   },
//   button: {
//     marginTop: 20,
//   },
// });

// export default LoginScreen;



import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios'; // 新增：导入 axios
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext'; // 导入 UserContext

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const { setUserDetails } = useContext(UserContext); // 从 UserContext 中获取 setUserDetails 方法

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonAnimation] = useState(new Animated.Value(1));

  const handleLogin = async () => {
    try {
      Animated.sequence([
        Animated.timing(buttonAnimation, {
          toValue: 1.2,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();

      const response = await axios.post('http://192.168.1.42:8000/login', {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        const data = response.data;
        // setUserName(data.username || email);
        setUserDetails({
          name: data.nickname,
          age: data.age,
          hobbies: data.hobbies,
          location: data.location,
        });
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.forgotPassword}>还没有账户？注册加入</Text>
        </TouchableOpacity>

        <Animated.View
          style={[styles.buttonContainer, { transform: [{ scale: buttonAnimation }] }]}
        >
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    color: '#fff',
    textAlign: 'right',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
