export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean | { [key: string]: boolean };
  loading?: boolean;
  loadingType?: string;
  loadingText?: string; // Adicione esta linha
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}