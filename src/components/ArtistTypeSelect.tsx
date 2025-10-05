import React from 'react';
import { Select } from 'antd';
import { ArtistType } from '@/interfaces/ArtistType';
import ArtistTypes from '@/strings/ArtistTypes';
import PersonIcon from '@mui/icons-material/Person4Outlined';
import MainStrings from '@/strings/MainStrings';

const artistTypes: ArtistType[] = ['composer', 'performer', 'primary'];

const options = artistTypes.map((type) => ({
  value: type,
  label: ArtistTypes[type],
}));

interface Props {
  onSelectChange?: (value: ArtistType) => void;
  defaultValue?: ArtistType;
}

export default function ArtistTypeSelect({ defaultValue, onSelectChange }: Props) {
  const handleChange = (value: string) => {
    const selectedType = value as ArtistType;
    onSelectChange?.(selectedType);
  };

  return (
    <Select
      defaultValue={defaultValue || undefined}
      showSearch
      placeholder={
        <span className="flex flex-row justify-center items-center gap-2">
          <PersonIcon fontSize="small" />
          {MainStrings.artistTypeSelectPlaceholder}
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
