'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Input, Layout, Pagination, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { fetchArtists } from '@/api/artistsApi';
import { GetArtistsRequest } from '@/interfaces/request/GetArtistsRequest';
import { ArtistsResponse } from '@/interfaces/response/ArtistsResponse';
import ArtistCard from '@/components/ArtistCard';
import { UserOutlined } from '@ant-design/icons';
import Strings from '@/strings/MainStrings';
import ArtistTypeSelect from '@/components/ArtistTypeSelect';
import { ArtistType } from '@/interfaces/ArtistType';

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
  paddingBlock: '1.5rem',
  paddingInline: '3rem',
  overflowX: 'hidden',
  overflowY: 'scroll',
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

const paginationStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
};

export default function Home() {
  // Artists data
  const [artists, setArtists] = useState<Artist[]>([]);

  // Filters
  const [artistType, setArtistType] = useState<ArtistType>();
  const [startsWithLetter, _setStartsWithLetter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(50);

  const getArtists = useCallback(
    async (params?: {
      artistType?: ArtistType;
      startsWithLetter?: string;
      search?: string;
      page?: number;
      perPage?: number;
    }) => {
      const config: GetArtistsRequest = {
        includeImage: true,
        ...(params?.artistType && { artistType: params.artistType }),
        ...(params?.startsWithLetter && { startsWithLetter: params.startsWithLetter }),
        ...(params?.search && { search: params.search }),
        ...(params?.page ? { page: params.page } : { page: 1 }),
        ...(params?.perPage && { per_page: params.perPage }),
      };

      try {
        const response = await fetchArtists(config);

        // Arist data
        setArtists(response.data);

        // Pagination data
        const { pagination } = response;
        setPage(pagination.current_page);
        setTotalItems(pagination.total_items);
      } catch (error) {
        console.error('Error setting artist:', error);
      }
    },
    [],
  );

  useEffect(() => {
    void getArtists();
  }, [getArtists]);

  const handleArtistTypeSelectChange = (type: ArtistType) => {
    setArtistType(type);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchButtonClick = () => {
    void getArtists({ artistType, startsWithLetter, search, page, perPage });
  };

  const handlePageChange = (newPage: number, _newPageSize: number) => {
    setPage(newPage);
    void getArtists({ artistType, startsWithLetter, search, page: newPage, perPage });
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPerPage(size);
  };

  return (
    <div className="w-full h-full">
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <section className="flex flex-row gap-4" id="filters">
            <div className="w-48">
              <ArtistTypeSelect onSelectChange={handleArtistTypeSelectChange} />
            </div>
            <div className="w-64">
              <Input
                onChange={handleSearchInputChange}
                size="large"
                placeholder={Strings.searchInputPlaceholder}
                prefix={<UserOutlined />}
              />
            </div>
            <div>
              <Button onClick={handleSearchButtonClick} size="large">
                {Strings.searchButtonText}
              </Button>
            </div>
          </section>
        </Header>
        <Content style={contentStyle}>
          <>
            <Row
              gutter={[
                { xs: 16, sm: 24, md: 32, lg: 40 },
                { xs: 8, sm: 12, md: 16, lg: 20 },
              ]}
            >
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
            <div hidden={artists.length === 0}>
              <Pagination
                style={paginationStyle}
                current={page}
                defaultCurrent={1}
                total={totalItems}
                pageSize={perPage}
                onChange={handlePageChange}
                onShowSizeChange={handleShowSizeChange}
              />
            </div>
          </>
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </div>
  );
}
