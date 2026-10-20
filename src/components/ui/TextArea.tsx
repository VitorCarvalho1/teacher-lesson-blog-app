import React from 'react';
import TextField from '@/components/ui/TextField';

type TextAreaProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
};

export default function TextArea({
  label,
  value,
  onChangeText,
  error,
  hint,
  placeholder,
  disabled = false,
  required = false,
  rows = 5,
  maxLength,
}: TextAreaProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      hint={hint}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      multiline
      numberOfLines={rows}
      maxLength={maxLength}
    />
  );
}
