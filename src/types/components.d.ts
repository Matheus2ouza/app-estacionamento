export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean | {
    edit?: boolean;
    delete?: boolean;
    secondTicket?: boolean;
    reactivate?: boolean; // Adicione esta linha
  };
  loadingType?: 'edit' | 'delete' | 'secondTicket' | 'reactivate'; // Atualize esta linha
  loadingText?: string;
}