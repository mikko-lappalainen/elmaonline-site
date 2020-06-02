import React, { useState, useEffect } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import withStyles from 'isomorphic-style-loader/withStyles';
import { useStoreState, useStoreActions } from 'easy-peasy';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import OutsideClickHandler from 'react-outside-click-handler';

import { Number } from 'components/Selectors';
import Records from './Records';
import TotalTimes from './TotalTimes';

// eslint-disable-next-line css-modules/no-unused-class
import s from './LevelPack.css';

const GET_LEVELPACK = gql`
  query($name: String!) {
    getLevelPack(LevelPackName: $name) {
      LevelPackIndex
      LevelPackLongName
      LevelPackName
      LevelPackDesc
      KuskiData {
        Kuski
      }
      Levels {
        LevelIndex
        LevelPackLevelIndex
        Level {
          LevelName
          LongName
        }
      }
    }
  }
`;

const LevelPack = ({ name }) => {
  const { highlight, totaltimes } = useStoreState(state => state.LevelPack);
  const { getHighlight, getTotalTimes } = useStoreActions(
    actions => actions.LevelPack,
  );
  const [openSettings, setOpenSettings] = useState(false);
  const [highlightWeeks, setHighlightWeeks] = useState(1);
  const [tts, getTTs] = useState(0);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getHighlight();
  }, []);

  useEffect(() => {
    if (tts) {
      getTotalTimes(tts);
    }
  }, [tts]);

  return (
    <div className={s.root}>
      <Query query={GET_LEVELPACK} variables={{ name }}>
        {({ data: { getLevelPack }, loading, error }) => {
          if (!loading) {
            getTTs(getLevelPack.LevelPackIndex);
          }
          if (loading) return null;
          if (error) return <div>something went wrong</div>;
          return (
            <>
              <Tabs value={tab} onChange={(e, t) => setTab(t)}>
                <Tab label="Records" />
                <Tab label="Total Times" />
              </Tabs>
              <div className={s.levelPackName}>
                <span className={s.shortName}>
                  {getLevelPack.LevelPackName}
                </span>{' '}
                <span className={s.longName}>
                  {getLevelPack.LevelPackLongName}
                </span>
              </div>
              <div className={s.description}>{getLevelPack.LevelPackDesc}</div>
              <Settings>
                {openSettings ? (
                  <OutsideClickHandler
                    onOutsideClick={() => setOpenSettings(false)}
                  >
                    <Paper>
                      <SettingsHeader>
                        <ClickCloseIcon
                          onClick={() => setOpenSettings(false)}
                        />
                        <SettingsHeadline>Settings</SettingsHeadline>
                      </SettingsHeader>
                      <SettingItem>
                        Highlight times newer than{' '}
                        <Number
                          number={highlightWeeks}
                          updated={n => setHighlightWeeks(n)}
                          name="weeks"
                          numbers={[0, 1, 2, 3, 4]}
                        />
                      </SettingItem>
                    </Paper>
                  </OutsideClickHandler>
                ) : (
                  <ClickSettingsIcon onClick={() => setOpenSettings(true)} />
                )}
              </Settings>
              {tab === 0 && (
                <Records
                  getLevelPack={getLevelPack}
                  highlight={highlight}
                  highlightWeeks={highlightWeeks}
                />
              )}
              {tab === 1 && (
                <TotalTimes
                  totals={totaltimes}
                  highlight={highlight}
                  highlightWeeks={highlightWeeks}
                />
              )}
            </>
          );
        }}
      </Query>
    </div>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string.isRequired,
};

const Settings = styled.div`
  padding: 0 10px;
  margin-bottom: 26px;
  font-size: 14px;
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 2px;
`;

const SettingsHeadline = styled.div`
  color: #8c8c8c;
  font-size: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  margin: 6px;
  padding-bottom: 6px;
`;

const ClickSettingsIcon = styled(SettingsIcon)`
  cursor: pointer;
`;

const ClickCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

export default withStyles(s)(LevelPack);
