// Copyright © 2022 Kaleido, Inc.
//
// SPDX-License-Identifier: Apache-2.0
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Box, Button, Grid, TablePagination, Typography } from '@mui/material';
import { BarDatum } from '@nivo/bar';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CardEmptyState } from '../../../components/Cards/CardEmptyState';
import { ChartHeader } from '../../../components/Charts/Header';
import { Histogram } from '../../../components/Charts/Histogram';
import { getCreatedFilter } from '../../../components/Filters/utils';
import { Header } from '../../../components/Header';
import { FFCircleLoader } from '../../../components/Loaders/FFCircleLoader';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { EventSlide } from '../../../components/Slides/EventSlide';
import { DataTable } from '../../../components/Tables/Table';
import { DataTableEmptyState } from '../../../components/Tables/TableEmptyState';
import { IDataTableRecord } from '../../../components/Tables/TableInterfaces';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  BucketCollectionEnum,
  BucketCountEnum,
  EventKeyEnum,
  FF_Paths,
  ICreatedFilter,
  IEvent,
  IMetricType,
  IPagedEventResponse,
} from '../../../interfaces';
import { DEFAULT_PADDING, FFColors } from '../../../theme';
import {
  fetchCatcher,
  isEventHistogramEmpty,
  makeEventHistogram,
} from '../../../utils';

const PAGE_LIMITS = [10, 25];

export const ActivityEvents: () => JSX.Element = () => {
  const { createdFilter, lastEvent, selectedNamespace } =
    useContext(ApplicationContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  // Events
  const [events, setEvents] = useState<IEvent[]>([]);
  // Event totals
  const [eventTotal, setEventTotal] = useState(0);
  // Event types histogram
  const [eventHistData, setEventHistData] = useState<BarDatum[]>();
  // View transaction slide out
  const [viewEvent, setViewEvent] = useState<IEvent | undefined>();

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_LIMITS[0]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    if (
      newPage > currentPage &&
      rowsPerPage * (currentPage + 1) >= eventTotal
    ) {
      return;
    }
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPage(0);
    setRowsPerPage(+event.target.value);
  };

  const pagination = (
    <TablePagination
      component="div"
      count={-1}
      rowsPerPage={rowsPerPage}
      page={currentPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={PAGE_LIMITS}
      labelDisplayedRows={({ from, to }) => `${from} - ${to}`}
      sx={{ color: 'text.secondary' }}
    />
  );

  // Events
  useEffect(() => {
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${
        FF_Paths.events
      }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
        createdFilterObject.filterString
      }`
    )
      .then((eventRes: IPagedEventResponse) => {
        setEvents(eventRes.items);
        setEventTotal(eventRes.total);
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [rowsPerPage, currentPage, selectedNamespace]);

  // Histogram
  useEffect(() => {
    const currentTime = dayjs().unix();
    const createdFilterObject: ICreatedFilter = getCreatedFilter(createdFilter);

    fetchCatcher(
      `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.chartsHistogram(
        BucketCollectionEnum.Events
      )}?startTime=${
        createdFilterObject.filterTime
      }&endTime=${currentTime}&buckets=${BucketCountEnum.Large}`
    )
      .then((histTypes: IMetricType[]) => {
        setEventHistData(makeEventHistogram(histTypes));
      })
      .catch((err) => {
        reportFetchError(err);
      });
  }, [selectedNamespace, createdFilter, lastEvent, createdFilter]);

  const eventsColumnHeaders = [
    t('sequence'),
    t('type'),
    t('eventID'),
    t('transactionID'),
    t('referenceID'),
    t('created'),
  ];

  const eventsRecords: IDataTableRecord[] = events.map((event) => ({
    key: event.id,
    columns: [
      {
        value: <Typography>{event.sequence}</Typography>,
      },
      {
        value: <Typography>{event.type.toLocaleUpperCase()}</Typography>,
      },
      {
        value: <HashPopover shortHash={true} address={event.id}></HashPopover>,
      },
      {
        value: <HashPopover shortHash={true} address={event.tx}></HashPopover>,
      },
      {
        value: (
          <HashPopover shortHash={true} address={event.reference}></HashPopover>
        ),
      },
      { value: dayjs(event.created).format('MM/DD/YYYY h:mm A') },
    ],
    onClick: () => setViewEvent(event),
  }));

  return (
    <>
      <Header title={t('events')} subtitle={t('activity')}></Header>
      <Grid container px={DEFAULT_PADDING}>
        <Grid container item wrap="nowrap" direction="column">
          <ChartHeader
            title={t('allEvents')}
            filter={
              <Button variant="outlined">
                <Typography p={0.75} sx={{ fontSize: 12 }}>
                  {t('filter')}
                </Typography>
              </Button>
            }
          />
          <Box
            mt={1}
            pb={2}
            borderRadius={1}
            sx={{
              width: '100%',
              height: 200,
              backgroundColor: 'background.paper',
            }}
          >
            {!eventHistData ? (
              <FFCircleLoader height={200} color="warning"></FFCircleLoader>
            ) : isEventHistogramEmpty(eventHistData) ? (
              <CardEmptyState
                height={200}
                text={t('noEvents')}
              ></CardEmptyState>
            ) : (
              <Histogram
                colors={[FFColors.Yellow, FFColors.Orange, FFColors.Pink]}
                data={eventHistData}
                indexBy="timestamp"
                keys={[
                  EventKeyEnum.BLOCKCHAIN,
                  EventKeyEnum.MESSAGES,
                  EventKeyEnum.TOKENS,
                ]}
                includeLegend={true}
              ></Histogram>
            )}
          </Box>
          {!events ? (
            <FFCircleLoader color="warning"></FFCircleLoader>
          ) : events.length ? (
            <DataTable
              stickyHeader={true}
              minHeight="300px"
              maxHeight="calc(100vh - 340px)"
              records={eventsRecords}
              columnHeaders={eventsColumnHeaders}
              {...{ pagination }}
            />
          ) : (
            <DataTableEmptyState
              message={t('noEventsToDisplay')}
            ></DataTableEmptyState>
          )}
        </Grid>
      </Grid>
      {viewEvent && (
        <EventSlide
          event={viewEvent}
          open={!!viewEvent}
          onClose={() => {
            setViewEvent(undefined);
          }}
        />
      )}
    </>
  );
};
