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

import { Grid, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Jazzicon from 'react-jazzicon';
import { useParams } from 'react-router-dom';
import { FFBreadcrumb } from '../../../components/Breadcrumbs/FFBreadcrumb';
import { FFCopyButton } from '../../../components/Buttons/CopyButton';
import { DetailsCard } from '../../../components/Cards/DetailsCard';
import { Header } from '../../../components/Header';
import { PoolList } from '../../../components/Lists/PoolList';
import { HashPopover } from '../../../components/Popovers/HashPopover';
import { TransferSlide } from '../../../components/Slides/TransferSlide';
import { FFTableText } from '../../../components/Tables/FFTableText';
import { MediumCardTable } from '../../../components/Tables/MediumCardTable';
import { DataTable } from '../../../components/Tables/Table';
import { FFJsonViewer } from '../../../components/Viewers/FFJsonViewer';
import { ApplicationContext } from '../../../contexts/ApplicationContext';
import { DateFilterContext } from '../../../contexts/DateFilterContext';
import { SlideContext } from '../../../contexts/SlideContext';
import { SnackbarContext } from '../../../contexts/SnackbarContext';
import {
  FF_NAV_PATHS,
  FF_Paths,
  FF_TRANSFER_CATEGORY_MAP,
  IDataTableRecord,
  IFFBreadcrumb,
  IFireFlyCard,
  IPagedTokenTransferResponse,
  ITokenBalance,
  ITokenPool,
  ITokenTransfer,
  TransferIconMap,
} from '../../../interfaces';
import {
  DEFAULT_BORDER_RADIUS,
  DEFAULT_PADDING,
  DEFAULT_PAGE_LIMITS,
} from '../../../theme';
import {
  fetchCatcher,
  getFFTime,
  getShortHash,
  jsNumberForAddress,
} from '../../../utils';

export const PoolDetails: () => JSX.Element = () => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { dateFilter } = useContext(DateFilterContext);
  const { slideID, setSlideSearchParam } = useContext(SlideContext);
  const { reportFetchError } = useContext(SnackbarContext);
  const { t } = useTranslation();
  const { poolID } = useParams<{ poolID: string }>();
  // Pools
  const [pool, setPool] = useState<ITokenPool>();
  const [isMounted, setIsMounted] = useState(false);
  const [viewTransfer, setViewTransfer] = useState<ITokenTransfer>();

  // Token transfers
  const [tokenTransfers, setTokenTransfers] = useState<ITokenTransfer[]>();
  // Token Transfer totals
  const [tokenTransferTotal, setTokenTransferTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_PAGE_LIMITS[0]);
  // Pool accounts
  const [poolAccounts, setPoolAccounts] = useState<ITokenBalance[]>();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    isMounted &&
      slideID &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenTransferById(
          slideID
        )}`
      )
        .then((transferRes: ITokenTransfer) => {
          setViewTransfer(transferRes);
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [slideID, isMounted]);

  useEffect(() => {
    if (poolID && isMounted) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenPoolsById(
          poolID
        )}`
      )
        .then((pool: ITokenPool) => {
          isMounted && setPool(pool);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [poolID, isMounted]);

  // Pool balances
  useEffect(() => {
    if (pool && isMounted) {
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${FF_Paths.tokenBalances}?pool=${pool?.id}`
      )
        .then((balances: ITokenBalance[]) => {
          isMounted && setPoolAccounts(balances);
        })
        .catch((err) => {
          reportFetchError(err);
        });
    }
  }, [pool, isMounted]);

  // Token transfers and accounts
  useEffect(() => {
    isMounted &&
      dateFilter &&
      fetchCatcher(
        `${FF_Paths.nsPrefix}/${selectedNamespace}${
          FF_Paths.tokenTransfers
        }?limit=${rowsPerPage}&count&skip=${rowsPerPage * currentPage}${
          dateFilter.filterString
        }&pool=${pool?.id}`
      )
        .then((tokenTransferRes: IPagedTokenTransferResponse) => {
          if (isMounted) {
            setTokenTransfers(tokenTransferRes.items);
            setTokenTransferTotal(tokenTransferRes.total);
          }
        })
        .catch((err) => {
          reportFetchError(err);
        });
  }, [
    rowsPerPage,
    dateFilter,
    currentPage,
    selectedNamespace,
    pool,
    isMounted,
  ]);

  const breadcrumbs: IFFBreadcrumb[] = [
    {
      link: FF_NAV_PATHS.tokensPoolsPath(selectedNamespace),
      content: t('tokenPools'),
    },
    {
      content: (
        <>
          {getShortHash(pool?.name ?? '')}
          <FFCopyButton value={pool?.name ?? ''} />
        </>
      ),
    },
  ];

  const poolAccountsColHeaders = [t('key'), t('balance')];
  const poolAccountsRecords: IDataTableRecord[] | undefined = poolAccounts?.map(
    (account, idx) => ({
      key: idx.toString(),
      columns: [
        {
          value: <HashPopover shortHash address={account.key} />,
        },
        {
          value: <FFTableText color="primary" text={account.balance} />,
        },
      ],
    })
  );

  const accountsCard: IFireFlyCard = {
    headerText: t('accountsInPool'),
    clickPath:
      pool && FF_NAV_PATHS.tokensBalancesPathByPool(selectedNamespace, pool.id),
    component: (
      <MediumCardTable
        records={poolAccountsRecords}
        columnHeaders={poolAccountsColHeaders}
        emptyMessage={t('noTokenAccounts')}
      ></MediumCardTable>
    ),
  };

  const infoCard: IFireFlyCard = {
    headerText: t('poolInfo'),
    component: pool?.info && <FFJsonViewer json={pool?.info} />,
  };

  const tokenTransferColHeaders = [
    t('activity'),
    t('from'),
    t('to'),
    t('amount'),
    t('blockchainEvent'),
    t('signingKey'),
    t('timestamp'),
  ];
  const tokenTransferRecords: IDataTableRecord[] | undefined =
    tokenTransfers?.map((transfer) => ({
      key: transfer.localId,
      columns: [
        {
          value: (
            <FFTableText
              color="primary"
              text={t(FF_TRANSFER_CATEGORY_MAP[transfer.type]?.nicename)}
              icon={TransferIconMap[transfer.type]}
            />
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.from ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.to ?? t('nullAddress')}
            ></HashPopover>
          ),
        },
        {
          value: <FFTableText color="primary" text={transfer.amount} />,
        },
        {
          value: (
            <HashPopover
              shortHash={true}
              address={transfer.blockchainEvent}
            ></HashPopover>
          ),
        },
        {
          value: (
            <HashPopover shortHash={true} address={transfer.key}></HashPopover>
          ),
        },
        {
          value: (
            <FFTableText color="secondary" text={getFFTime(transfer.created)} />
          ),
        },
      ],
      onClick: () => {
        setViewTransfer(transfer);
        setSlideSearchParam(transfer.localId);
      },
      leftBorderColor: FF_TRANSFER_CATEGORY_MAP[transfer.type]?.color,
    }));

  return (
    <>
      <Header
        title={<FFBreadcrumb breadcrumbs={breadcrumbs} />}
        subtitle={t('activity')}
      ></Header>
      <Grid container px={DEFAULT_PADDING}>
        {/* Left hand side */}
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={5}
          pr={DEFAULT_PADDING}
        >
          {/* Pool Card */}
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'background.paper',
              padding: DEFAULT_PADDING,
              borderRadius: DEFAULT_BORDER_RADIUS,
            }}
          >
            {pool && (
              <Grid
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                container
              >
                <Grid container item justifyContent="flex-start" xs={2}>
                  <Jazzicon diameter={34} seed={jsNumberForAddress(pool.id)} />
                </Grid>
                <Grid container item justifyContent="flex-start" xs={10}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '14',
                    }}
                    pb={1}
                  >
                    {pool.name}
                  </Typography>
                </Grid>
                <PoolList pool={pool} />
              </Grid>
            )}
          </Paper>
        </Grid>
        {/* Right hand side */}
        <Grid
          container
          item
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
          xs={4}
        >
          {/* Transfers */}
          <Grid
            direction="row"
            alignItems="center"
            justifyContent="center"
            container
            item
            height="100%"
          >
            <DetailsCard card={infoCard} />
          </Grid>
        </Grid>
        <Grid
          pl={DEFAULT_PADDING}
          container
          item
          direction="row"
          justifyContent="flex-center"
          alignItems="flex-start"
          xs={3}
        >
          {/* Accounts */}
          <Grid
            direction="row"
            alignItems="center"
            justifyContent="center"
            container
            item
            height="100%"
          >
            <DetailsCard card={accountsCard} />
          </Grid>
        </Grid>
        <Grid item pt={3} container direction="row" justifyContent={'flex-end'}>
          <DataTable
            header={t('transfersInPool')}
            onHandleCurrPageChange={(currentPage: number) =>
              setCurrentPage(currentPage)
            }
            onHandleRowsPerPage={(rowsPerPage: number) =>
              setRowsPerPage(rowsPerPage)
            }
            stickyHeader={true}
            minHeight="300px"
            maxHeight="calc(100vh - 800px)"
            records={tokenTransferRecords}
            columnHeaders={tokenTransferColHeaders}
            paginate={true}
            emptyStateText={t('noTokenTransfersToDisplay')}
            dataTotal={tokenTransferTotal}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            dashboardSize
            clickPath={FF_NAV_PATHS.tokensTransfersPath(
              selectedNamespace,
              pool?.id
            )}
          />
        </Grid>
      </Grid>
      {viewTransfer && (
        <TransferSlide
          transfer={viewTransfer}
          open={!!viewTransfer}
          onClose={() => {
            setViewTransfer(undefined);
            setSlideSearchParam(null);
          }}
        />
      )}
    </>
  );
};
