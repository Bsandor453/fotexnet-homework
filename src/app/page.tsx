'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Col,
  ConfigProvider,
  Input,
  Layout,
  Pagination,
  Row,
  Spin,
  theme,
} from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { fetchArtists } from '@/api/artistsApi';
import { GetArtistsRequest } from '@/interfaces/request/GetArtistsRequest';
import { ArtistsResponse } from '@/interfaces/response/ArtistsResponse';
import ArtistCard from '@/components/ArtistCard';
import { UserOutlined } from '@ant-design/icons';
import Strings from '@/strings/MainStrings';
import ArtistTypeSelect from '@/components/ArtistTypeSelect';
import { ArtistType } from '@/interfaces/ArtistType';
import InitialLetterSelect from '@/components/InitialLetterSelect';
import Image from 'next/image';

type Artist = ArtistsResponse;

const headerStyle = (darkMode: boolean): React.CSSProperties => ({
  textAlign: 'center',
  height: 64,
  paddingInline: 64,
  lineHeight: '64px',
  color: '#fff',
  backgroundColor: darkMode ? '#1f1f1f' : '#f5f5f5',
  borderWidth: '0px 0px 1px 0px',
  borderColor: darkMode ? '#595959' : '#d8d8d8',
});

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  paddingBlock: '1.5rem',
  paddingInline: '3rem',
  overflowX: 'hidden',
  overflowY: 'auto',
  scrollbarGutter: 'stable both-edges',
};

const footerStyle = (darkMode: boolean): React.CSSProperties => ({
  textAlign: 'center',
  color: darkMode ? '#fff' : '#000',
  backgroundColor: darkMode ? '#1f1f1f' : '#f5f5f5',
  borderWidth: '1px 0px 0px 0px',
  borderColor: darkMode ? '#595959' : '#d8d8d8',
});

const layoutStyle = {
  width: '100%',
  height: '100%',
};

const paginationStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
};

export default function App() {
  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Artists data
  const [artists, setArtists] = useState<Artist[]>([]);

  // Filters
  const [artistType, setArtistType] = useState<ArtistType>();
  const [startsWithLetter, setStartsWithLetter] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(50);

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getArtists = useCallback(
    async (params?: {
      artistType?: ArtistType;
      startsWithLetter?: string;
      search?: string;
      page?: number;
      perPage?: number;
    }) => {
      setLoading(true);
      setError(null);

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

        // Artist data
        setArtists(response.data);

        // Pagination data
        const { pagination } = response;
        setPage(pagination.current_page);
        setTotalItems(pagination.total_items);
      } catch (error: any) {
        const errorMessage = error.response.data.message;
        setError(errorMessage);
        console.error('Error getting artists:', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void getArtists({ page, perPage });
  }, [getArtists, page, perPage]);

  const handleArtistTypeSelectChange = (type: ArtistType) => {
    setArtistType(type);
  };

  const handleInitialLetterSelectChange = (initialLetter: string) => {
    setStartsWithLetter(initialLetter);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchButtonClick = () => {
    void getArtists({ artistType, startsWithLetter, search, page, perPage });
  };

  const handleDarkModeButtonClick = () => {
    setDarkMode((prevState) => !prevState);
  };

  const handleRetryButtonClick = () => {
    void getArtists({ artistType, startsWithLetter, search, page, perPage });
  };

  const handlePageChange = (newPage: number, _newPageSize: number) => {
    setPage(newPage);
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    setPerPage(size);
    setPage(1);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="w-full h-full">
        <Layout style={layoutStyle}>
          <Header style={headerStyle(darkMode)}>
            <section className="flex flex-row gap-4 justify-between" id="settings">
              <section className="flex flex-row gap-4" id="filters">
                <div className="w-48">
                  <ArtistTypeSelect onSelectChange={handleArtistTypeSelectChange} />
                </div>
                <div className="w-48">
                  <InitialLetterSelect onSelectChange={handleInitialLetterSelectChange} />
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
              <div>
                <Button onClick={handleDarkModeButtonClick} size="large">
                  {darkMode ? Strings.setToLightMode : Strings.setToDarkMode}
                </Button>
              </div>
            </section>
          </Header>

          <Content style={contentStyle}>
            <>
              {loading || error ? (
                <div className="w-full h-full flex justify-center items-center">
                  {loading ? (
                    <Spin size="large" />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Alert message={error} type="error" showIcon />
                      <Button onClick={handleRetryButtonClick} size="large">
                        {Strings.retry}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Row
                    gutter={[
                      { xs: 28, sm: 32, md: 36, lg: 40 },
                      { xs: 20, sm: 24, md: 28, lg: 32 },
                    ]}
                    justify="start"
                  >
                    {artists.map((artist: Artist) => (
                      <Col
                        className="gutter-row"
                        key={artist.id}
                        xs={24} // Extra small screen (e.g. Mobile) -> 1 column
                        sm={12} // Small screen -> 2 column
                        md={8} // Medium screen -> 3 column
                        lg={6} // Large screen (e.g. PC) -> 4 column
                      >
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
              )}
            </>
          </Content>

          <Footer style={footerStyle(darkMode)}>
            <div className="flex flex-row justify-center items-center gap-2">
              {Strings.footerText}
              <Image
                className="w-14"
                draggable={false}
                alt="Fotexnet logo"
                src="/fotexnet-logo.webp"
                width={100}
                height={100}
              />
            </div>
          </Footer>
        </Layout>
      </div>
    </ConfigProvider>
  );
}
