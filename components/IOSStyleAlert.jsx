import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const IOSStyleAlert = ({ visible, title, message, buttons = [], onClose }) => {
  // If no buttons are provided, add a default "OK" button
  const displayButtons =
    buttons.length > 0 ? buttons : [{ text: "OK", onPress: onClose }];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {displayButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  index > 0 && styles.buttonBorder,
                  button.style === "cancel" && styles.cancelButton,
                ]}
                onPress={() => {
                  button.onPress?.();
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "destructive" &&
                      styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 14,
    width: "70%",
    overflow: "hidden",
  },
  titleContainer: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CCCCCC",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#CCCCCC",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
  },
  buttonBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: "#CCCCCC",
  },
  buttonText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  destructiveButtonText: {
    color: "#FF3B30",
  },
  cancelButton: {
    fontWeight: "400",
  },
});

export default IOSStyleAlert;
