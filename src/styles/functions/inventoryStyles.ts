import { StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    color: Colors.gray.dark,
  },
  searchFilterContainer: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    gap: 6,
  },
  filterButtonSelected: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontFamily: 'Roboto_500Medium',
    color: Colors.primary,
  },
  filterButtonTextSelected: {
    color: Colors.white,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.gray.medium,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyLink: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  productCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  indexText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: Colors.primary,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: Colors.gray.darker,
  },
  cardDetails: {
    gap: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: Colors.gray.dark,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: Colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});