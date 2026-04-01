import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  onClose?: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons,
  icon = "alert-circle",
  iconColor = "#F2AB2F",
  onClose,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  // Default button if none provided
  const activeButtons =
    buttons && buttons.length > 0
      ? buttons
      : [{ text: "OK", style: "default", onPress: onClose } as AlertButton];

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onClose) {
      onClose();
    }
  };

  const getButtonStyle = (style?: string) => {
    switch (style) {
      case "cancel":
        return "bg-gray-100";
      case "destructive":
        return "bg-red-500";
      default:
        return "bg-primary-500";
    }
  };

  const getButtonTextStyle = (style?: string) => {
    switch (style) {
      case "cancel":
        return "text-gray-700";
      case "destructive":
      case "default":
        return "text-white";
      default:
        return "text-white";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        className="items-center justify-center bg-black/50 px-6"
        style={{
          width: width,
          height: height,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: width - 64,
            maxWidth: 340,
          }}
          className="bg-white rounded-3xl overflow-hidden"
        >
          <View className="items-center pt-6 pb-3">
            <View className="w-14 h-14 rounded-full items-center justify-center">
              <Ionicons name={icon} size={28} color={iconColor} />
            </View>
          </View>

          <View className="px-5 pb-5">
            <Text className="text-lg font-bold text-gray-900 text-center mb-1.5">
              {title}
            </Text>
            <Text className="text-sm text-gray-600 text-center leading-5">
              {message}
            </Text>
          </View>

          <View className="border-t border-gray-100">
            {activeButtons.length === 1 ? (
              <TouchableOpacity
                onPress={() => handleButtonPress(activeButtons[0])}
                className={`py-3.5 ${getButtonStyle(activeButtons[0].style)}`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center font-bold text-sm ${getButtonTextStyle(
                    activeButtons[0].style
                  )}`}
                >
                  {activeButtons[0].text}
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row">
                {activeButtons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleButtonPress(button)}
                    className={`flex-1 py-3.5  justify-center ${
                      index > 0 ? "border-l border-gray-100" : ""
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-center font-bold  text-sm ${
                        button.style === "destructive"
                          ? "text-red-500"
                          : button.style === "cancel"
                            ? "text-gray-600"
                            : "text-primary-500"
                      }`}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
