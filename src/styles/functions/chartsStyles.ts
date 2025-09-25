import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  content: {
    flex: 1,
    padding: 20,
  },
  
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptyDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  emptySubDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  
  chartsContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 12,
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.red[600],
    marginBottom: 8,
    textAlign: 'center',
  },
  
  errorText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  retryButton: {
    backgroundColor: Colors.blue[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});