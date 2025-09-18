import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },

  // Header informativo
  infoCard: {
    padding: 20,
    backgroundColor: Colors.blue.primary,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.blue.light,
    shadowColor: Colors.blue.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  infoText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  
  // Estados vazios
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  emptySubDescription: {
    fontSize: 14,
    color: Colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Cards de período
  periodsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  periodCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
    flex: 1,
  },
  periodCardSelected: {
    borderColor: Colors.blue[600],
    backgroundColor: Colors.blue[50],
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  periodTitleSelected: {
    color: Colors.blue[600],
  },
  periodDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Cards de gráficos
  chartsContainer: {
    gap: 12,
  },
  chartCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
    position: 'relative',
  },
  chartCardSelected: {
    borderColor: Colors.blue[600],
    backgroundColor: Colors.blue[50],
  },
  chartCardDisabled: {
    opacity: 0.6,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  chartInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chartBadgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  chartTitleSelected: {
    color: Colors.blue[600],
  },
  chartTitleDisabled: {
    color: Colors.text.tertiary,
  },
  chartDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  chartDescriptionDisabled: {
    color: Colors.text.tertiary,
  },
  comingSoonBadge: {
    backgroundColor: Colors.orange[500],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },

  // Botão de gerar
  generateSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  generateButton: {
    backgroundColor: Colors.blue[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  generateButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});