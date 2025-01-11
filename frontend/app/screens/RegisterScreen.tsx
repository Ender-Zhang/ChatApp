// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = () => {
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then(() => {
    //     navigation.navigate('Profile');
    //   })
    //   .catch(error => {
    //     alert(error.message);
    //   });
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">注册</Text>
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
