export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean | { [key: string]: boolean };
  loading?: boolean;
  loadingType?: string;
  icon?: React.ReactNode; // Nova prop
  iconPosition?: 'left' | 'right'; // Nova prop
}