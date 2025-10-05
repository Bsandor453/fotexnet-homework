'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Input, Layout, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { fetchArtists } from '@/api/artistsApi';
import { GetArtistsRequest } from '@/interfaces/request/GetArtistsRequest';
import { ArtistsResponse } from '@/interfaces/response/ArtistsResponse';
import ArtistCard from '@/components/ArtistCard';
import { UserOutlined } from '@ant-design/icons';
import Strings from '@/strings/Strings_en';

type Artist = ArtistsResponse;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#4096ff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#4096ff',
};

const layoutStyle = {
  width: '100%',
  height: '100%',
};

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState<string>('');
  const [startsWithLetter, _setStartsWithLetter] = useState<string>('');

  const getArtists = useCallback(
    async (params?: { search?: string; startsWithLetter?: string }) => {
      const config: GetArtistsRequest = {
        artistType: 'performer',
        includeImage: true,
        page: 1,
        per_page: 20,
        ...(params?.search && { search: params.search }),
        ...(params?.startsWithLetter && { startsWithLetter: params.startsWithLetter }),
      };

      try {
        const response = await fetchArtists(config);
        setArtists(response.data);
      } catch (error) {
        console.error('Error setting artist:', error);
      }
    },
    [],
  );

  useEffect(() => {
    void getArtists();
  }, [getArtists]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const onSearchButtonClick = () => {
    void getArtists({ search, startsWithLetter });
  };

  return (
    <div className="w-full h-full">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <section className="flex flex-row" id="filters">
            <div className="w-64">
              <Input
                onChange={onInputChange}
                size="large"
                placeholder={Strings.searchInputPlaceholder}
                prefix={<UserOutlined />}
              />
            </div>
            <div className="w-32">
              <Button onClick={onSearchButtonClick}>{Strings.searchButtonText}</Button>
            </div>
          </section>
        </Header>
        <Content style={contentStyle}>
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {artists.map((artist: Artist) => (
                <Col className="gutter-row" key={artist.id} span={6}>
                  <ArtistCard
                    name={artist.name}
                    albumCount={artist.albumCount}
                    portraitUrl={artist.portrait}
                  />
                </Col>
              ))}
            </Row>
          </>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  );
}
