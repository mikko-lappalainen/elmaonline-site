import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from 'isomorphic-style-loader/withStyles';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';

import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import LegacyIcon from 'styles/LegacyIcon';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const GET_LEVEL = gql`
  query($LevelIndex: Int!) {
    getBestTimes(LevelIndex: $LevelIndex, Limit: 10) {
      TimeIndex
      KuskiIndex
      Time
      KuskiData {
        Kuski
        Country
        TeamData {
          Team
        }
      }
    }
    getLevel(LevelIndex: $LevelIndex) {
      LevelName
      LongName
    }
  }
`;

const LevelPopup = ({
  levelId,
  KuskiIndex,
  close,
  highlight,
  multi,
  showLegacyIcon,
}) => {
  const {
    personalAllFinished,
    levelBesttimes,
    levelMultiBesttimes,
    settings: { showLegacy },
  } = useStoreState(state => state.LevelPack);
  const {
    getPersonalAllFinished,
    getLevelBesttimes,
    getLevelMultiBesttimes,
  } = useStoreActions(actions => actions.LevelPack);
  const [timesLimit, setTimesLimit] = useState(10);

  useEffect(() => {
    if (levelId !== -1) {
      if (KuskiIndex) {
        getPersonalAllFinished({
          LevelIndex: levelId,
          KuskiIndex,
          limit: timesLimit,
          eolOnly: showLegacy ? 0 : 1,
        });
      } else if (multi) {
        getLevelMultiBesttimes({ levelId, limit: timesLimit });
      } else {
        getLevelBesttimes({
          levelId,
          limit: timesLimit,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [levelId, timesLimit]);

  const times = multi ? levelMultiBesttimes : levelBesttimes;

  return (
    <div className={s.levelPopup}>
      <Query query={GET_LEVEL} variables={{ LevelIndex: levelId }}>
        {({ data: { getLevel }, loading }) => {
          if (loading) return null;

          return (
            <>
              <div className={s.levelTimesContainer}>
                <div className={s.title}>
                  <Link to={`/levels/${levelId}`}>
                    {getLevel.LevelName}.lev
                  </Link>
                  <br />
                  {getLevel.LongName}
                  <div
                    tabIndex="0"
                    role="button"
                    className={s.closePopup}
                    onClick={close}
                    onKeyPress={close}
                  >
                    &times;
                  </div>
                </div>
                <h2>Top-{timesLimit.toLocaleString()} times</h2>
                <div className={s.levelTimes}>
                  <div className={s.tableHead}>
                    <span>#</span>
                    {!KuskiIndex && !multi && <span>Kuski</span>}
                    {multi && (
                      <>
                        <span>Kuski</span>
                        <span>Kuski</span>
                      </>
                    )}
                    <span>Time</span>
                    {times.length > 0 && times[0].Source !== undefined && (
                      <span />
                    )}
                    {personalAllFinished.length > 0 &&
                      personalAllFinished[0].Source !== undefined && <span />}
                  </div>
                  {!KuskiIndex ? (
                    <>
                      {times.map((t, i) => {
                        return (
                          <div
                            key={multi ? t.BestMultiTimeIndex : t.BestTimeIndex}
                          >
                            <span>{i + 1}.</span>
                            {multi ? (
                              <>
                                <span>
                                  <Kuski kuskiData={t.Kuski1Data} team flag />
                                </span>
                                <span>
                                  <Kuski kuskiData={t.Kuski2Data} team flag />
                                </span>
                                <TimeSpan highlight={t.TimeIndex >= highlight}>
                                  <Time time={t.Time} />
                                </TimeSpan>
                              </>
                            ) : (
                              <>
                                <span>
                                  <Kuski kuskiData={t.KuskiData} team flag />
                                </span>
                                <TimeSpan highlight={t.TimeIndex >= highlight}>
                                  <Time time={t.Time} />
                                </TimeSpan>
                                {t.Source !== undefined && (
                                  <LegacyIcon
                                    source={t.Source}
                                    show={showLegacyIcon}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      {personalAllFinished.map((t, i) => {
                        return (
                          <div key={`${t.TimeIndex}${t.Time}`}>
                            <span>{i + 1}.</span>
                            <TimeSpan highlight={t.TimeIndex >= highlight}>
                              <Time time={t.Time} />
                            </TimeSpan>
                            {t.Source !== undefined && (
                              <LegacyIcon
                                source={t.Source}
                                show={showLegacyIcon}
                              />
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
                <div className={s.showMore}>
                  {timesLimit === 10 ? (
                    <ShowMore onClick={() => setTimesLimit(10000)}>
                      Show more
                    </ShowMore>
                  ) : (
                    <ShowMore onClick={() => setTimesLimit(10)}>
                      Show less
                    </ShowMore>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </Query>
    </div>
  );
};

const ShowMore = styled.span`
  color: #219653;
  cursor: pointer;
`;

const TimeSpan = styled.span`
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
`;

export default withStyles(s)(LevelPopup);
