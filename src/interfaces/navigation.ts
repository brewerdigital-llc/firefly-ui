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

import { FF_OPS } from './enums';

export interface INavItem {
  name: string;
  action: () => void;
  icon?: JSX.Element;
  itemIsActive: boolean;
}

export const ACTIVITY_PATH = 'activity';
export const APIS_PATH = 'apis';
export const APPROVALS_PATH = 'approvals';
export const BALANCES_PATH = 'balances';
export const BATCHES_PATH = 'batches';
export const BLOCKCHAIN_PATH = 'blockchain';
export const DATA_PATH = 'data';
export const DATATYPES_PATH = 'datatypes';
export const DOCS_PATH = 'https://hyperledger.github.io/firefly/';
export const EVENTS_PATH = 'events';
export const FILE_EXPLORER_PATH = 'fileExplorer';
export const GROUPS_PATH = 'groups';
export const HOME_PATH = 'home';
export const IDENTITIES_PATH = 'identities';
export const INTERFACES_PATH = 'interfaces';
export const LISTENERS_PATH = 'listeners';
export const MESSAGES_PATH = 'messages';
export const MY_NODES_PATH = 'myNode';
export const NAMESPACES_PATH = 'namespaces';
export const NETWORK_PATH = 'network';
export const NODES_PATH = 'nodes';
export const OFFCHAIN_PATH = 'offChain';
export const OPERATIONS_PATH = 'operations';
export const ORGANIZATIONS_PATH = 'organizations';
export const POOLS_PATH = 'pools';
export const SUBSCRIPTIONS_PATH = 'subscriptions';
export const TOKENS_PATH = 'tokens';
export const TRANSACTIONS_PATH = 'transactions';
export const TRANSFERS_PATH = 'transfers';
export const WEBSOCKETS_PATH = 'websockets';

export const FF_NAV_PATHS = {
  // Home
  homePath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${HOME_PATH}`,
  // Activity
  activityTimelinePath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}`,
  activityEventsPath: (ns: string, eventID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${EVENTS_PATH}${
      eventID ? `?slide=${eventID}` : ''
    }`,
  activityEventsPathWithTxFilter: (ns: string, txID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${EVENTS_PATH}${
      txID ? `?filters=tx==${txID}` : ''
    }`,
  activityTxPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}`,
  activityTxDetailPath: (ns: string, txID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}/${txID}`,
  activityTxDetailPathWithSlide: (ns: string, txID: string, slideID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${TRANSACTIONS_PATH}/${txID}?slide=${slideID}`,
  activityOpPath: (ns: string, opID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}${
      opID ? `?slide=${opID}` : ''
    }`,
  activityOpPathWithTxFilter: (ns: string, txID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}${
      txID ? `?filters=tx==${txID}` : ''
    }`,
  activityOpErrorPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}?filters=error=!=`,
  // Blockchain
  blockchainPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}`,
  blockchainEventsPath: (ns: string, beID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${EVENTS_PATH}${
      beID ? `?slide=${beID}` : ''
    }`,
  blockchainApisPath: (ns: string, apiName?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${APIS_PATH}${
      apiName ? `?slide=${apiName}` : ''
    }`,
  blockchainInterfacesPath: (ns: string, interfaceID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${INTERFACES_PATH}${
      interfaceID ? `?slide=${interfaceID}` : ''
    }`,
  blockchainListenersPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${LISTENERS_PATH}`,
  blockchainListenersSinglePath: (ns: string, listenerID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${BLOCKCHAIN_PATH}/${LISTENERS_PATH}${`?slide=${listenerID}`}`,
  // Off-Chain
  offchainPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}`,
  offchainMessagesPath: (ns: string, msgID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${MESSAGES_PATH}${
      msgID ? `?slide=${msgID}` : ''
    }`,
  offchainDataPath: (ns: string, dataID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATA_PATH}${
      dataID ? `?slide=${dataID}` : ''
    }`,
  offchainDatatypesPath: (ns: string, datatypeID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${DATATYPES_PATH}${
      datatypeID ? `?slide=${datatypeID}` : ''
    }`,
  offchainBatchesPath: (ns: string, batchID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${BATCHES_PATH}${
      batchID ? `?slide=${batchID}` : ''
    }`,
  offchainGroupsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${OFFCHAIN_PATH}/${GROUPS_PATH}`,
  // Tokens
  tokensPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}`,
  tokensTransfersPath: (ns: string, poolID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${TRANSFERS_PATH}${
      poolID ? `?filters=pool==${poolID}` : ''
    }`,
  tokensTransfersErrorPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${ACTIVITY_PATH}/${OPERATIONS_PATH}?filters=error=!=&filters=type==${FF_OPS.TOKEN_TRANSFER}`,
  tokensTransfersPathLocalID: (ns: string, localID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${TRANSFERS_PATH}${
      localID ? `?slide=${localID}` : ''
    }`,
  tokensTransfersPathByKeyAndPool: (ns: string, key: string, pool: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${TRANSFERS_PATH}${`?filters=key==${key}&filters=pool==${pool}`}`,
  tokensPoolsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${POOLS_PATH}`,
  tokensPoolDetailsPath: (ns: string, poolID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${POOLS_PATH}/${poolID}`,
  tokensBalancesPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${BALANCES_PATH}`,
  tokensBalancesPathByPool: (ns: string, poolID: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${BALANCES_PATH}?filters=pool==${poolID}`,
  tokensApprovalsPath: (ns: string, approvalID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${TOKENS_PATH}/${APPROVALS_PATH}${
      approvalID ? '?slide=' + approvalID : ''
    }`,
  // Network
  networkPath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}`,
  networkOrgsPath: (ns: string, slideID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${ORGANIZATIONS_PATH}${
      slideID ? '?slide=' + slideID : ''
    }`,
  networkNodesPath: (ns: string, slideID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${NODES_PATH}${
      slideID ? '?slide=' + slideID : ''
    }`,
  networkIdentitiesPath: (ns: string, slideID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${IDENTITIES_PATH}${
      slideID ? '?slide=' + slideID : ''
    }`,
  networkNamespacesPath: (ns: string, slideID?: string) =>
    `/${NAMESPACES_PATH}/${ns}/${NETWORK_PATH}/${NAMESPACES_PATH}${
      slideID ? '?slide=' + slideID : ''
    }`,
  // My Node
  myNodePath: (ns: string) => `/${NAMESPACES_PATH}/${ns}/${MY_NODES_PATH}`,
  myNodeSubscriptionsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${MY_NODES_PATH}/${SUBSCRIPTIONS_PATH}`,
  myNodeWebsocketsPath: (ns: string) =>
    `/${NAMESPACES_PATH}/${ns}/${MY_NODES_PATH}/${WEBSOCKETS_PATH}`,
  // Docs
  docsPath: DOCS_PATH,
};
