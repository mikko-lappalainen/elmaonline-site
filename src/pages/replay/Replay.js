import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Paper } from 'styles/Paper';

import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import Link from 'components/Link';
import RecList from 'components/RecList';
import ReplayComments from 'components/ReplayComments';
import ReplayRating from 'components/ReplayRating';
import AddComment from 'components/AddComment';
import historyRefresh from 'utils/historyRefresh';

import s from './Replay.css';
import replayQuery from './replay.graphql';

class Replay extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      Loading: PropTypes.bool,
      getReplayByUuid: PropTypes.shape({
        LevelIndex: PropTypes.number,
        UUID: PropTypes.string,
        RecFileName: PropTypes.string,
        ReplayTime: PropTypes.number,
        TAS: PropTypes.number,
        Bug: PropTypes.number,
        Nitro: PropTypes.number,
        Unlisted: PropTypes.number,
        Finished: PropTypes.number,
      }),
    }).isRequired,
  };

  render() {
    const {
      data: { getReplayByUuid },
    } = this.props;
    const isWindow = typeof window !== 'undefined';
    let link = '';
    if (!getReplayByUuid) return null;
    if (isWindow) {
      link = `https://eol.ams3.digitaloceanspaces.com/${
        window.App.s3SubFolder
      }replays/${getReplayByUuid.UUID}/${getReplayByUuid.RecFileName}`;
    }

    return (
      <div className={s.root}>
        <div className={s.playerContainer}>
          <div className={s.player}>
            {isWindow && (
              <Recplayer
                rec={link}
                lev={`/dl/level/${getReplayByUuid.LevelIndex}`}
                controls
              />
            )}
          </div>
        </div>
        <div className={s.rightBarContainer}>
          <div className={s.chatContainer}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">
                  <>{getReplayByUuid.RecFileName}</>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <div className={s.replayDescription}>
                  <div>
                    {isWindow ? (
                      <>
                        <a href={link}>
                          <Time thousands time={getReplayByUuid.ReplayTime} />
                        </a>{' '}
                      </>
                    ) : (
                      <Time thousands time={getReplayByUuid.ReplayTime} />
                    )}
                    by{' '}
                    {getReplayByUuid.DrivenByData
                      ? getReplayByUuid.DrivenByData.Kuski
                      : 'Unknown'}{' '}
                    in <Level LevelData={getReplayByUuid.LevelData} />
                  </div>
                  <br />
                  <Link to={`/levels/${getReplayByUuid.LevelIndex}`}>
                    Go to level page
                  </Link>
                </div>
                <div>
                  {getReplayByUuid.TAS === 1 && (
                    <span style={{ color: 'red' }}>(TAS)</span>
                  )}
                  {getReplayByUuid.Unlisted === 1 && (
                    <span style={{ color: 'gray' }}>(Unlisted)</span>
                  )}
                  {getReplayByUuid.Finished === 0 && (
                    <span style={{ color: 'gray' }}>(DNF)</span>
                  )}
                  {getReplayByUuid.Bug === 1 && (
                    <span style={{ color: 'brown' }}>(Bug)</span>
                  )}
                  {getReplayByUuid.Nitro === 1 && (
                    <span style={{ color: 'blue' }}>(Mod)</span>
                  )}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {/* <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body1">
                  <React.Fragment>
                    <Level LevelData={getReplayByUuid.LevelData} />.lev
                  </React.Fragment>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <div>1. Zweq 01:22,49</div>
                <div>2. Zero 01:30,33</div>
                <div>3. talli 01:32,95</div>
                <div>etc.</div>
              </ExpansionPanelDetails>
            </ExpansionPanel> */}
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                <Typography variant="body2">Other replays in level</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                <RecList
                  LevelIndex={getReplayByUuid.LevelIndex}
                  currentUUID={getReplayByUuid.UUID}
                  openReplay={uuid => historyRefresh.push(`/r/${uuid}`)}
                  columns={['Replay', 'Time', 'By']}
                  horizontalMargin={-24}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        </div>
        <div className={s.levelStatsContainer}>
          <Paper className={s.ReplayDescription}>
            <div>
              <div>{getReplayByUuid.Comment}</div>
              <div className={s.battleTimestamp}>
                Uploaded by{' '}
                {getReplayByUuid.UploadedByData
                  ? getReplayByUuid.UploadedByData.Kuski
                  : 'Unknown'}{' '}
                <LocalTime
                  date={getReplayByUuid.Uploaded}
                  format="YYYY-MM-DD HH:mm:ss"
                  parse="X"
                />
              </div>
            </div>
            <ReplayRating ReplayIndex={getReplayByUuid.ReplayIndex} />
          </Paper>
        </div>
        <div className={s.levelStatsContainer}>
          <Paper className={s.battleDescription}>
            <AddComment
              add={() => {}}
              type="replay"
              index={getReplayByUuid.ReplayIndex}
            />
            <ReplayComments ReplayIndex={getReplayByUuid.ReplayIndex} />
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(s),
  graphql(replayQuery, {
    options: ownProps => ({
      variables: {
        UUID: ownProps.ReplayUuid,
      },
    }),
  }),
)(Replay);
