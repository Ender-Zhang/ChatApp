import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext'; // 导入 UserContext

// 定义导航类型
type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

// 定义表单字段类型
interface ProfileValues {
  name: string;
  age: string;       // 这里作为 string，方便表单输入
  hobbies: string;
  location: string;
}

// 表单验证规则
const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('必填'),
  age: Yup.number()
    .typeError('必须是数字')
    .required('必填')
    .positive('必须是正数')
    .integer('必须是整数'),
  hobbies: Yup.string(),
  location: Yup.string(),
});

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  
  // 从 Context 中获取 userDetails 和 setUserDetails 方法
  const { userDetails, setUserDetails } = useContext(UserContext);

  // 点击提交时执行
  const handleSubmit = async (values: ProfileValues) => {
    try {
      console.log('表单提交:', values);

      // 保存到 UserContext
      setUserDetails({
        id: userDetails.id,        name: values.name,
        age: values.age,
        hobbies: values.hobbies,
        location: values.location,
      });

      // 导航到下一个页面
      navigation.navigate('Matching');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>完善个人信息</Text>

      <Formik
        // 初始值：如果 userDetails 里有值，则使用其值，否则为空字符串
        initialValues={{
          name: userDetails?.name || '',
          age: userDetails?.age || '',
          hobbies: userDetails?.hobbies || '',
          location: userDetails?.location || '',
        }}
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

            <TextInput
              label="爱好"
              onChangeText={handleChange('hobbies')}
              onBlur={handleBlur('hobbies')}
              value={values.hobbies}
              style={styles.input}
            />
            {errors.hobbies && touched.hobbies ? (
              <Text style={styles.error}>{errors.hobbies}</Text>
            ) : null}

            <TextInput
              label="所在城市"
              onChangeText={handleChange('location')}
              onBlur={handleBlur('location')}
              value={values.location}
              style={styles.input}
            />
            {errors.location && touched.location ? (
              <Text style={styles.error}>{errors.location}</Text>
            ) : null}

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.button}
            >
              提交
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#7D26CD',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  error: {
    color: '#FFCDD2',
    marginBottom: 10,
    fontSize: 14,
  },
});
