// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileValues {
  name: string;
  age: string;
  // 其他字段...
}

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('必填'),
  age: Yup.number().typeError('必须是数字').required('必填').positive('必须是正数').integer('必须是整数'),
  // 其他字段的验证
});

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleSubmit = async (values: ProfileValues) => {
    // try {
    //   await setDoc(doc(db, "users", auth.currentUser?.uid || ""), {
    //     name: values.name,
    //     age: Number(values.age),
    //     // 其他字段...
    //   });
      navigation.navigate('Chat');
    // } catch (error: any) {
    //   alert(error.message);
    // }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">填写信息来帮助你匹配有缘人~</Text>
      <Formik
        initialValues={{ name: '', age: '' }}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="姓名"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              style={styles.input}
            />
            {errors.name && touched.name ? (
              <Text style={styles.error}>{errors.name}</Text>
            ) : null}
            <TextInput
              label="年龄"
              onChangeText={handleChange('age')}
              onBlur={handleBlur('age')}
              value={values.age}
              keyboardType="numeric"
              style={styles.input}
            />
            {errors.age && touched.age ? (
              <Text style={styles.error}>{errors.age}</Text>
            ) : null}
            {/* 添加更多字段 */}
            <Button mode="contained" onPress={() => handleSubmit()} style={styles.button}>
              提交
            </Button>
          </>
        )}
      </Formik>
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
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ProfileScreen;
