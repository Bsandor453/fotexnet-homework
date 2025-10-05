import React from 'react';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import Image from 'next/image';

interface Props {
  name: string;
  albumCount: number;
  portraitUrl: string;
}

export default function ArtistCard({ name, albumCount, portraitUrl }: Props) {
  return (
    <Card
      hoverable
      className="w-full transform transition duration-200 ease-in-out hover:scale-105 hover:shadow-xl"
      cover={
        <Image
          className="object-cover w-full h-48"
          draggable={false}
          alt={`${name} portrait`}
          src={portraitUrl}
          width={300}
          height={200}
          sizes="(max-width: 768px) 100vw, 400px"
        />
      }
    >
      <Meta title={name} description={`Albums: ${albumCount}`} />
    </Card>
  );
}
