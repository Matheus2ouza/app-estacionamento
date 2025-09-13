import Colors from '@/src/constants/Colors';
import { TypographyThemes } from '@/src/constants/Fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Product {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  barcode?: string;
  expirationDate?: string;
  isActive?: boolean;
}

interface ProductConfirmationModalProps {
  visible: boolean;
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductConfirmationModal({
  visible,
  product,
  onConfirm,
  onCancel,
  loading = false
}: ProductConfirmationModalProps) {
  // Não renderizar se não há dados do produto
  if (!product || !product.id) {
    return null;
  }
  const formatPrice = (price: number | undefined) => {
    if (!price && price !== 0) return 'Não informado';
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informada';
    return dateString;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Ionicons name="cube-outline" size={24} color={Colors.blue.primary} />
              <Text style={styles.title}>Confirmar Alterações</Text>
            </View>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            <Text style={[styles.subtitle, { marginBottom: 10 }]}>Dados do Produto</Text>
            
            <View style={styles.warningContainer}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.orange[500]} />
              <Text style={styles.warningText}>
                Confirme se os dados estão corretos antes de salvar as alterações.
              </Text>
            </View>

            
            {/* Product Details */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="pricetag-outline" size={16} color={Colors.blue.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Nome do Produto</Text>
                  <Text style={styles.detailValue}>{product.productName || 'Não informado'}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="cash-outline" size={16} color={Colors.blue.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Preço Unitário</Text>
                  <Text style={styles.detailValue}>{formatPrice(product.unitPrice)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="layers-outline" size={16} color={Colors.blue.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Quantidade</Text>
                  <Text style={styles.detailValue}>{product.quantity || 'Não informado'}</Text>
                </View>
              </View>

              {product.barcode && (
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="barcode-outline" size={16} color={Colors.blue.primary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Código de Barras</Text>
                    <Text style={styles.detailValue}>{product.barcode}</Text>
                  </View>
                </View>
              )}

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.blue.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Validade</Text>
                  <Text style={styles.detailValue}>{formatDate(product.expirationDate)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons 
                    name={product.isActive ? "checkmark-circle-outline" : "close-circle-outline"} 
                    size={16} 
                    color={product.isActive ? Colors.green[500] : Colors.red[500]} 
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text style={[
                    styles.detailValue,
                    { color: product.isActive ? Colors.green[500] : Colors.red[500] }
                  ]}>
                    {product.isActive ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onCancel}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.confirmButton, loading && styles.confirmButtonDisabled]} 
              onPress={onConfirm}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.confirmButtonText}>
                {loading ? 'Salvando...' : 'Confirmar Alterações'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%' as any,
    maxWidth: 400,
    maxHeight: '80%' as any,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  title: {
    ...TypographyThemes.poppins.title,
    color: Colors.text.primary,
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  subtitle: {
    ...TypographyThemes.inter.subtitle,
    color: Colors.text.primary,
    marginBottom: 16,
    fontWeight: '600' as const,
  },
  detailsContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 40,
  },
  detailRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...TypographyThemes.nunito.caption,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    ...TypographyThemes.openSans.body,
    color: Colors.text.primary,
    fontWeight: '500' as const,
  },
  warningContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: Colors.orange[50],
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange[500],
    marginBottom: 10,
  },
  warningText: {
    ...TypographyThemes.nunito.bodySmall,
    color: Colors.orange[700],
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  cancelButtonText: {
    ...TypographyThemes.openSans.button,
    color: Colors.text.secondary,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.blue.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  confirmButtonText: {
    ...TypographyThemes.openSans.button,
    color: Colors.white,
    fontWeight: '600' as const,
  },
};
