'use client';

import React, { useEffect, useState } from 'react';
import { Col, Layout, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { fetchArtists } from '@/api/artistsApi';
import { GetArtistsRequest } from '@/interfaces/request/GetArtistsRequest';
import { ArtistsResponse } from '@/interfaces/response/ArtistsResponse';

type Artist = ArtistsResponse;

export default function Home() {
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const getArtists = async () => {
      const config: GetArtistsRequest = {
        artistType: 'performer',
        startsWithLetter: 'B',
        includeImage: true,
        search: 'Szabo',
        page: 1,
        per_page: 20,
      };

      try {
        const response = await fetchArtists(config);
        setArtists(response.data);
      } catch (error) {
        console.error('Error setting artist:', error);
      }
    };

    void getArtists();
  }, []);

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

  const style: React.CSSProperties = { background: '#0092ff', padding: '8px' };

  return (
    <div className="w-full h-full">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>Header</Header>
        <Content style={contentStyle}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {artists.map((artist: Artist) => (
              <Col className="gutter-row" key={artist.id} span={6}>
                <div style={style}>{artist.name}</div>
              </Col>
            ))}
          </Row>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  );
}
