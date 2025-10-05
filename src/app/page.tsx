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
import { useQueryParams } from '@/hooks/useQueryParams';

type Artist = ArtistsResponse;

const headerStyle = (darkMode: boolean): React.CSSProperties => ({
  textAlign: 'center',
  paddingInline: '4rem',
  lineHeight: 'normal',
  color: '#fff',
  minHeight: '4rem',
  height: 'auto',
  backgroundColor: darkMode ? '#1f1f1f' : '#f5f5f5',
  borderBottom: `1px solid ${darkMode ? '#595959' : '#d8d8d8'}`,
});

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
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
  borderTop: `1px solid ${darkMode ? '#595959' : '#d8d8d8'}`,
});

const layoutStyle = {
  width: '100%',
  height: '100%',
};

const paginationStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
  marginBottom: '1rem',
};

export default function App() {
  // Custom hook for URL query param handling
  const { getParam, setParams } = useQueryParams();

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Artists data
  const [artists, setArtists] = useState<Artist[]>([]);

  // Filters (initialized from the URL query params)
  const [search, setSearch] = useState(getParam('search') ?? '');
  const [artistType, setArtistType] = useState<ArtistType>(
    (getParam('artistType') as ArtistType) ?? '',
  );
  const [startsWithLetter, setStartsWithLetter] = useState(getParam('startsWithLetter') ?? '');

  // Pagination
  const [page, setPage] = useState<number>(Number(getParam('page')) || 1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(Number(getParam('perPage')) || 50);

  // State
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchCompleted, setFetchCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getArtists = useCallback(
    async (
      params: {
        artistType?: ArtistType;
        startsWithLetter?: string;
        search?: string;
        page?: number;
        perPage?: number;
      } = {},
    ) => {
      setLoading(true);
      setFetchCompleted(false);
      setError(null);

      const { artistType, startsWithLetter, search, page = 1, perPage } = params;

      const config: GetArtistsRequest = {
        includeImage: true,
        ...(artistType && { artistType }),
        ...(startsWithLetter && { startsWithLetter }),
        ...(search && { search }),
        page,
        ...(perPage && { per_page: perPage }),
      };

      try {
        const { data, pagination } = await fetchArtists(config);

        setArtists(data);
        setPage(pagination.current_page);
        setTotalItems(pagination.total_items);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          'An unexpected error occurred while retrieving artists.';
        setError(message);
        console.error('Error getting artists:', message);
      } finally {
        setLoading(false);
        setFetchCompleted(true);
      }
    },
    [],
  );

  useEffect(() => {
    void getArtists({ artistType, startsWithLetter, search, page, perPage });
    // Note: Don't want to getArtists when startsWithLetter or search are changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getArtists, page, perPage]);

  const handleArtistTypeSelectChange = (type: ArtistType) => {
    // Update the URL query param for the artist type
    setParams({ artistType: type });

    setArtistType(type);
  };

  const handleInitialLetterSelectChange = (initialLetter: string) => {
    // Update the URL query param for the initial letter
    setParams({ startsWithLetter: initialLetter });

    setStartsWithLetter(initialLetter);
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearchButtonClick = () => {
    // Update the URL query params
    setParams({ search, artistType, startsWithLetter, page: 1 });

    void getArtists({ artistType, startsWithLetter, search, page, perPage });
  };

  const handleDarkModeButtonClick = () => {
    setDarkMode((prevState) => !prevState);
  };

  const handleRetryButtonClick = () => {
    void getArtists({ artistType, startsWithLetter, search, page, perPage });
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    // Update the URL query param for the current page and the page size
    setParams({ page: newPage, perPage: newPageSize });

    setPage(newPage);
  };

  const handleShowSizeChange = (_current: number, size: number) => {
    // Update the URL query param for the current page and the page size
    setParams({ page: 1, perPage: size });

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
            <section
              className="h-full py-2 flex flex-row flex-wrap items-center gap-x-4 gap-y-2 justify-between"
              id="settings"
            >
              <section
                className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2"
                id="filters"
              >
                <div className="w-48">
                  <ArtistTypeSelect
                    defaultValue={artistType}
                    onSelectChange={handleArtistTypeSelectChange}
                  />
                </div>
                <div className="w-48">
                  <InitialLetterSelect
                    defaultValue={startsWithLetter}
                    onSelectChange={handleInitialLetterSelectChange}
                  />
                </div>
                <div className="w-64">
                  <Input
                    defaultValue={search}
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
                <div
                  className="flex w-full h-full flex-col gap-2 justify-between"
                  hidden={!fetchCompleted}
                >
                  {artists.length === 0 ? (
                    <div className="flex w-full h-full justify-center items-center">
                      <Alert message={Strings.noResults} type="info" showIcon />
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
                      <div>
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
                </div>
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
