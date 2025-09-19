import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SortOption {
  key: string;
  label: string;
  icon: string;
}

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  sortOptions?: SortOption[];
  selectedSort?: string | string[];
  onSortChange?: (sortKey: string | string[]) => void;
  showSortOptions?: boolean;
  multipleSelection?: boolean;
}

export default function SearchInput({
  searchQuery,
  onSearchChange,
  placeholder = "Buscar...",
  sortOptions = [],
  selectedSort,
  onSortChange,
  showSortOptions = true,
  multipleSelection = false,
}: SearchInputProps) {
  const handleSortToggle = (sortKey: string) => {
    if (!onSortChange) return;

    if (multipleSelection) {
      // Múltiplas seleções
      const currentSelection = Array.isArray(selectedSort) ? selectedSort : [];
      
      if (currentSelection.includes(sortKey)) {
        // Remove a opção se já estiver selecionada
        const newSelection = currentSelection.filter(key => key !== sortKey);
        onSortChange(newSelection);
      } else {
        // Adiciona a opção se não estiver selecionada
        onSortChange([...currentSelection, sortKey]);
      }
    } else {
      // Seleção única (toggle)
      if (selectedSort === sortKey) {
        onSortChange("");
      } else {
        onSortChange(sortKey);
      }
    }
  };

  const isOptionSelected = (sortKey: string) => {
    if (multipleSelection) {
      return Array.isArray(selectedSort) && selectedSort.includes(sortKey);
    }
    return selectedSort === sortKey;
  };

  return (
    <View style={styles.container}>
      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.gray[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor={Colors.gray[400]}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange("")}>
              <Ionicons name="close-circle" size={20} color={Colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Opções de Ordenação */}
      {showSortOptions && sortOptions.length > 0 && (
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Ordenar por:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortOptionsContainer}
          >
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  isOptionSelected(option.key) && styles.sortOptionSelected,
                ]}
                onPress={() => handleSortToggle(option.key)}
              >
                <Ionicons
                  name={option.icon as any}
                  size={14}
                  color={
                    isOptionSelected(option.key)
                      ? Colors.white
                      : Colors.text.secondary
                  }
                />
                <Text
                  style={[
                    styles.sortOptionText,
                    isOptionSelected(option.key) && styles.sortOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  searchContainer: {
    paddingTop: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingTop: 5,
    paddingBottom: 5,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 5,
  },
  sortOptionsContainer: {
    gap: 10,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.blue.dark,
    gap: 4
  },
  sortOptionSelected: {
    backgroundColor: Colors.blue.primary,
    borderColor: Colors.blue.primary,
    shadowColor: Colors.blue.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sortOptionText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  sortOptionTextSelected: {
    color: Colors.white,
    fontWeight: "600",
  },
});
