import type { ServerSideEditViewProps } from 'payload';

import type * as Generated from '#payload/generated-types';

import { getEventsForTrial, getPage } from './utils';

export async function EventsComponent({ initPageResult }: ServerSideEditViewProps) {
    const id = parseInt(initPageResult.docID || '', 10);
    const collection = initPageResult.collectionConfig
        ?.slug! as keyof Generated.Config['collections'];
    const trial = await getPage(id, collection);

    if (!trial) {
        return null;
    }

    const events = await getEventsForTrial(trial.id);

    return (
        <div style={{ padding: '24px 75px' }}>
            <h4 style={{ marginBottom: '10px' }}>Pages Visited</h4>
            <ul style={{ paddingLeft: '14px' }}>
                {events.docs?.map((doc) => (
                    <li
                        key={doc.id}
                        style={{
                            color: doc.happenedAfterConversion
                                ? 'gray'
                                : doc.isFirstEvent
                                  ? 'green'
                                  : doc.isLastEvent
                                    ? 'orange'
                                    : 'black',
                        }}
                    >
                        <a href={`/admin/collections/events/${doc.id}`}>{doc.path}</a>
                        {` `}({new Date(doc.createdAt).toUTCString()})
                    </li>
                ))}
            </ul>
        </div>
    );
}
