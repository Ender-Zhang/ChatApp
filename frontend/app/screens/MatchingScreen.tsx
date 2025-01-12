import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MatchingScreen = () => {
  const navigation = useNavigation(); // 获取导航对象
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. 启动旋转动画
    const anim = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();

    // 2. 3秒后跳转到下一个页面
    const timer = setTimeout(() => {
      // 可根据需要先停止动画
      anim.stop();
      navigation.navigate('Main', {
        screen: 'Chat', // TabNavigator 中的目标选项卡
        params: { name: "李皓月" }, // 添加随机参数
      });
      
    }, 1000);

    // 组件卸载时，清理定时器和动画
    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [navigation, rotateAnim]);

  // 将 0~1 的数值映射到角度 0~360 deg
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          { transform: [{ rotate: rotateInterpolate }] },
        ]}
      />
      <Text style={styles.text}>
        正在帮您匹配最合适您的人...
      </Text>
    </View>
  );
};

export default MatchingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // 垂直水平居中
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: '#aaa',
    borderTopColor: '#4CAF50',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
