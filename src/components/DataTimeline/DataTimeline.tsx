// Copyright © 2021 Kaleido, Inc.
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

import React from 'react';
import { Paper, makeStyles } from '@material-ui/core';
import { Timeline } from '@material-ui/lab';
import { ITimelineItem } from '../../interfaces';
import { TimelineItemWrapper } from './TimelineItemWrapper';

interface Props {
  items: ITimelineItem[];
}

export const DataTimeline: React.FC<Props> = ({ items }) => {
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
        <Timeline>
          {items.map((item) => (
            <TimelineItemWrapper item={item} opposite />
          ))}
        </Timeline>
      </Paper>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    width: '100%',
    maxHeight: 'calc(100vh - 100px)',
    overflow: 'auto',
  },
}));
