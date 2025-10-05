import React from 'react';
import { Card, theme } from 'antd';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';
import AlbumIcon from '@mui/icons-material/Album';

interface Props {
  name: string;
  albumCount: number;
  portraitUrl: string;
}

export default function ArtistCard({ name, albumCount, portraitUrl }: Props) {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      className="w-full transform !transition duration-200 ease-in-out hover:scale-105 hover:shadow-xl"
      cover={
        <Image
          className="object-cover w-full h-48"
          draggable={false}
          alt={`${name} portrait`}
          src={portraitUrl}
          width={800}
          height={600}
        />
      }
    >
      <Meta
        title={name}
        description={
          <span style={{ color: token.colorTextSecondary }}>
            <AlbumIcon fontSize="small" /> Albums: {albumCount}
          </span>
        }
      />
    </Card>
  );
}
