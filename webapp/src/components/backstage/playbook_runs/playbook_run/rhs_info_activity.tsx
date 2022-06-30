// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useIntl} from 'react-intl';
import {DateTime} from 'luxon';

import {useSelector} from 'react-redux';
import {GlobalState} from '@mattermost/types/store';
import {getChannelsNameMapInCurrentTeam} from 'mattermost-redux/selectors/entities/channels';
import {getTeam} from 'mattermost-redux/selectors/entities/teams';

import {Section, SectionTitle} from 'src/components/backstage/playbook_runs/playbook_run/rhs_info_styles';
import {Role} from 'src/components/backstage/playbook_runs/shared';
import {PlaybookRun} from 'src/types/playbook_run';
import TimelineEventItem from 'src/components/backstage/playbook_runs/playbook_run_backstage/retrospective/timeline_event_item';
import {ItemList} from 'src/components/backstage/playbook_runs/playbook_run/rhs_timeline';
import {clientRemoveTimelineEvent} from 'src/client';

import {useTimelineEvents} from './timeline_utils';

const SHOWED_EVENTS = 5;

interface Props {
    run: PlaybookRun;
    role: Role;
}

const RHSInfoActivity = ({run, role}: Props) => {
    const {formatMessage} = useIntl();
    const [filteredEvents] = useTimelineEvents(run);
    const channelNamesMap = useSelector(getChannelsNameMapInCurrentTeam);
    const team = useSelector((state: GlobalState) => getTeam(state, run.team_id));

    return (
        <Section>
            <SectionTitle>{formatMessage({defaultMessage: 'Recent Activity'})}</SectionTitle>
            <ItemList>
                {filteredEvents.slice(0, SHOWED_EVENTS).map((event, i, events) => {
                    let prevEventAt;
                    if (i !== events.length - 1) {
                        prevEventAt = DateTime.fromMillis(events[i + 1].event_at);
                    }
                    return (
                        <TimelineEventItem
                            key={event.id}
                            event={event}
                            prevEventAt={prevEventAt}
                            parent={'rhs'}
                            runCreateAt={DateTime.fromMillis(run.create_at)}
                            channelNames={channelNamesMap}
                            team={team}
                            deleteEvent={() => clientRemoveTimelineEvent(run.id, event.id)}
                            disableLinks={true}
                            editable={role === Role.Participant}
                        />
                    );
                })}
            </ItemList>
        </Section>
    );
};

export default RHSInfoActivity;
