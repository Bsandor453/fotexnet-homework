import React from 'react';
import { Select } from 'antd';
import MainStrings from '@/strings/MainStrings';
import AbcIcon from '@mui/icons-material/AbcOutlined';

const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const options = letters.map((letter) => ({
  value: letter,
  label: letter,
}));

interface Props {
  onSelectChange?: (value: string) => void;
  defaultValue?: string;
}

export default function InitialLetterSelect({ defaultValue, onSelectChange }: Props) {
  const handleChange = (value: string) => {
    onSelectChange?.(value);
  };

  return (
    <Select
      defaultValue={defaultValue || undefined}
      showSearch
      placeholder={
        <span className="flex flex-row justify-center items-center gap-2">
          <AbcIcon fontSize="small" />
          {MainStrings.initialLetterSelectPlaceholder}
        </span>
      }
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      size="large"
      style={{ width: '100%' }}
      onChange={handleChange}
      options={options}
    />
  );
}
