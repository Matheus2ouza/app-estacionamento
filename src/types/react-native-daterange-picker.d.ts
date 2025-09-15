declare module 'react-native-daterange-picker' {
  import { Component } from 'react';
  
  interface DateRangePickerProps {
    onChange: (date: any) => void;
    endDate?: Date | null;
    startDate?: Date | null;
    displayedLocale?: string;
    range?: boolean;
    open: boolean;
    onClose: () => void;
  }
  
  export default class DateRangePicker extends Component<DateRangePickerProps> {}
}
