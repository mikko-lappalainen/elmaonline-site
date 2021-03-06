/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid, Tabs, Tab } from '@material-ui/core';
import { Paper } from 'styles/Paper';
import { ListRow, ListCell, ListHeader } from 'styles/List';
import { mod } from 'utils/nick';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import { Check, Clear } from '@material-ui/icons';

const Mod = () => {
  const { nickChanges } = useStoreState(state => state.Mod);
  const { getNickChanges, acceptNick, declineNick } = useStoreActions(
    actions => actions.Mod,
  );
  const [tab, setTab] = useState(0);

  useEffect(() => {
    getNickChanges();
  }, []);

  return (
    <>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => setTab(value)}
      >
        <Tab label="Dashboard" />
        <Tab label="Ban" />
        <Tab label="Reports" />
        <Tab label="Error log" />
        <Tab label="Mod log" />
        <Tab label="Level locking" />
      </Tabs>
      <Container>
        {mod() > 0 ? (
          <>
            {tab === 0 && (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={6}>
                  <Paper>
                    <ListHeader>
                      <ListCell>Old nick</ListCell>
                      <ListCell>New nick</ListCell>
                      <ListCell>Accept</ListCell>
                      <ListCell>Decline</ListCell>
                    </ListHeader>
                    {nickChanges.length > 0 &&
                      nickChanges.map(n => (
                        <ListRow>
                          <ListCell>
                            <Kuski kuskiData={n.KuskiData} />
                          </ListCell>
                          <ListCell>{n.Setting}</ListCell>
                          <ListCell>
                            <Accept onClick={() => acceptNick(n)} />
                          </ListCell>
                          <ListCell>
                            <Decline onClick={() => declineNick(n)} />
                          </ListCell>
                        </ListRow>
                      ))}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </>
        ) : (
          <div>You are not a mod or not logged in.</div>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Accept = styled(Check)`
  cursor: pointer;
`;

const Decline = styled(Clear)`
  cursor: pointer;
`;

export default Mod;
