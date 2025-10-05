import React from 'react';
import { Select } from 'antd';
import { ArtistType } from '@/interfaces/ArtistType';
import ArtistTypes from '@/strings/ArtistTypes';
import MainStrings from '@/strings/MainStrings';

const artistTypes: ArtistType[] = ['composer', 'performer', 'primary'];

const options = artistTypes.map((type) => ({
  value: type,
  label: ArtistTypes[type],
}));

interface Props {
  onSelectChange?: (value: ArtistType) => void;
}

export default function ArtistTypeSelect({ onSelectChange }: Props) {
  const handleChange = (value: string) => {
    const selectedType = value as ArtistType;
    onSelectChange?.(selectedType);
  };

  return (
    <Select
      showSearch
      placeholder={MainStrings.artistTypeSelectPlaceholder}
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
