import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface RoleMenuProps {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  style?: any;
  disabled?: boolean;
}

const RoleDropdown = ({
  label,
  value,
  onChange,
  options,
  style,
  disabled = false,
}: RoleMenuProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdownButton, disabled && styles.disabledButton]}
        onPress={() => !disabled && setShowOptions(prev => !prev)}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
      >
        <Text style={[styles.dropdownText, disabled && styles.disabledText]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      {showOptions && !disabled && (
        <View style={styles.optionsContainer}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setShowOptions(false);
                }}
                style={styles.optionItem}
              >
                <Text style={styles.optionText}>{option.label}</Text>
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
    backgroundColor: "transparent"
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  optionsContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 4,
    marginTop: 5,
    zIndex: 999,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  disabledButton: {
    backgroundColor: "#f2f2f2",
    borderColor: "#ddd",
  },
  disabledText: {
    color: "#999",
  },
});

export default RoleDropdown;
