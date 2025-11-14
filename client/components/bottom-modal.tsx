import classNames from "classnames";
import React from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";

export default function BottomModal({
  visible,
  onClose,
  children,
  showKnob = true,
  className,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showKnob?: boolean;
  className?: string;
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-[#FFFFFFCC]"
        onPress={onClose}
        accessibilityLabel="Close modal"
      >
        <View
          className={classNames(
            "mt-auto bg-[#F8F8F8] border-t border-[#E0E0E0] rounded-t-[32px] max-h-[85%]", // limit modal height
            className
          )}
        >
          {showKnob && (
            <View
              style={{ backgroundColor: "#E0E0E0", width: 50, height: 6 }}
              className="rounded-full self-center mt-5 mb-3"
            />
          )}

          {/* Scrollable content area */}
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}
