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

import { Grid } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IFireflyApi } from '../../interfaces';
import { DEFAULT_PADDING } from '../../theme';
import { JsonViewAccordion } from '../Accordions/JsonViewerAccordion';
import { ApiList } from '../Lists/ApiList';
import { DisplaySlide } from './DisplaySlide';
import { SlideHeader } from './SlideHeader';

interface Props {
  api: IFireflyApi;
  open: boolean;
  onClose: () => void;
}

export const ApiSlide: React.FC<Props> = ({ api, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DisplaySlide open={open} onClose={onClose}>
        <Grid container direction="column" p={DEFAULT_PADDING}>
          {/* Title */}
          <SlideHeader subtitle={t('api')} title={api.name} />
          {/* Data list */}
          <Grid container item>
            <ApiList api={api} />
          </Grid>
          {/* API Location */}
          {api.location && (
            <Grid container item>
              <JsonViewAccordion
                isOpen
                json={api.location}
                header={t('location')}
              />
            </Grid>
          )}
        </Grid>
      </DisplaySlide>
    </>
  );
};
