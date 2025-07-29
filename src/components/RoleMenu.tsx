import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";

interface RoleMenuProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  style?: any;
  disabled?: boolean;
  error?: boolean;
}

const RoleMenu = ({
  label,
  value,
  onChange,
  options,
  style,
  disabled = false,
  error = false,
}: RoleMenuProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || label;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          disabled && styles.disabledButton,
          error && styles.errorButton,
        ]}
        onPress={() => !disabled && setShowOptions((prev) => !prev)}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Text
          style={[
            styles.dropdownText,
            disabled && styles.disabledText,
            !value && styles.placeholderText,
          ]}
        >
          {selectedLabel}
        </Text>
        <MaterialIcons
          name={showOptions ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={disabled ? Colors.gray.light : Colors.blue.logo}
        />
      </TouchableOpacity>

      {showOptions && !disabled && (
        <View style={styles.optionsContainer}>
          <ScrollView
            nestedScrollEnabled
            style={styles.optionsScroll}
            keyboardShouldPersistTaps="handled"
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setShowOptions(false);
                }}
                style={[
                  styles.optionItem,
                  value === option.value && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    value === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {value === option.value && (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={Colors.blue.logo}
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: "transparent",
    zIndex: 1000, // Garante que o dropdown fique acima de outros elementos
  },
  dropdownButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray.light,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.gray.dark,
  },
  placeholderText: {
    color: Colors.gray.medium,
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    borderColor: Colors.gray.light,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
    marginTop: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  optionsScroll: {
    maxHeight: 200,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: Colors.gray.extraLight,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.blue.extraLight,
  },
  optionText: {
    fontSize: 16,
    color: Colors.gray.dark,
  },
  selectedOptionText: {
    color: Colors.blue.logo,
    fontWeight: "500",
  },
  checkIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: Colors.gray.light,
    borderColor: Colors.gray.light,
  },
  disabledText: {
    color: Colors.gray.medium,
  },
  errorButton: {
    borderColor: Colors.red.error,
  },
});

export default RoleMenu;