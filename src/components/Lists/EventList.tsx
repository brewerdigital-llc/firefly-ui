import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApplicationContext } from '../../contexts/ApplicationContext';
import { FF_EVENTS_CATEGORY_MAP, IEvent } from '../../interfaces';
import { IDataListItem } from '../../interfaces/lists';
import { FFCopyButton } from '../Buttons/CopyButton';
import { TxButton } from '../Buttons/TxButton';
import { FFListItem } from './FFListItem';
import { FFListText } from './FFListText';
import { FFListTimestamp } from './FFListTimestamp';
import { FFSkeletonList } from './FFSkeletonList';

interface Props {
  event?: IEvent;
  showTxLink?: boolean;
}

export const EventList: React.FC<Props> = ({ event, showTxLink = true }) => {
  const { selectedNamespace } = useContext(ApplicationContext);
  const { t } = useTranslation();
  const [dataList, setDataList] = useState<IDataListItem[]>(FFSkeletonList);

  useEffect(() => {
    if (event) {
      setDataList([
        {
          label: t('eventID'),
          value: <FFListText color="primary" text={event.id} />,
          button: <FFCopyButton value={event.id} />,
        },
        {
          label: t(FF_EVENTS_CATEGORY_MAP[event.type].referenceIDName),
          value: <FFListText color="primary" text={event.reference} />,
          button: (
            <>
              {FF_EVENTS_CATEGORY_MAP[event.type].referenceIDButton(
                selectedNamespace,
                event.reference
              )}
              <FFCopyButton value={event.reference} />
            </>
          ),
        },
        {
          label: event.tx ? t('transactionID') : '',
          value: event.tx && <FFListText color="primary" text={event.tx} />,
          button: event.tx ? (
            <>
              {showTxLink && (
                <TxButton ns={selectedNamespace} txID={event.tx} />
              )}
              <FFCopyButton value={event.tx} />
            </>
          ) : (
            <></>
          ),
        },
        {
          label: t('created'),
          value: <FFListTimestamp ts={event.created} />,
        },
      ]);
    }
  }, [event]);

  return (
    <>
      {dataList.map(
        (d, idx) => d.label !== '' && <FFListItem key={idx} item={d} />
      )}
    </>
  );
};
