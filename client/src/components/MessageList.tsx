import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../hooks/redux'; // типизированный  useSelector
import { ROOT_URL } from '../constanst/url';

// типизация пропсов

type PropsType = {
  content: string;
  time: string;
  avatar: string;
  login: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '36ch',
      backgroundColor: theme.palette.background.paper,
      alignItems: 'flex-end',
    },
    inline: {
      display: 'block',
    },
  })
);

const MessageList: React.FC<PropsType> = ({ content, time, avatar, login }) => {
  const classes = useStyles(login);
  const { user } = useAppSelector((state) => state.authReducer);

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={`${ROOT_URL}/${avatar}`} />
        </ListItemAvatar>
        <ListItemText
          primary={login}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {content}
              </Typography>
              <Typography
                component="span"
                variant="caption"
                className={classes.inline}
                color="primary"
              >
                {time}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
};

export default MessageList;
