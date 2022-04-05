import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { useAppSelector } from '../hooks/redux'; // типизированный  useSelector
import { ROOT_URL } from '../constanst/url';
import { UserType } from '../store/reducers/AuthSlice';
import { MessageType } from './MessageForm';

// типизация пропсов
type ParamType = {
  user: UserType;
  item: MessageType;
};
type PropsType = {
  item: MessageType;
};

const useStyles = makeStyles(() =>
  createStyles({
    message_container: {
      display: 'flex',
      //изменяем расположние сообщений
      justifyContent: ({ user, item }: ParamType): string => {
        if (user.login === item.from.login) {
          return 'flex-end';
        }
        return 'flex-start';
      },
    },
    message: {
      margin: '10px',
      padding: '10px',
      minWidth: 0,
      maxWidth: '50%',
      minHeight: '80px',
      borderRadius: '10px',
      // изменяет цвет сособщений
      backgroundColor: ({ user, item }): string => {
        if (user.login === item.from.login) {
          return '#b2dfdb';
        }
        return '#b3e5fc';
      },

      //,
    },
    typografy: {
      wordWrap: 'break-word',
      marginRight: '10px',
    },
  })
);

const MessageList: React.FC<PropsType> = ({ item }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const classes = useStyles({ user, item });
  return (
    <div className={classes.message_container}>
      <List className={classes.message}>
        <ListItem style={{ alignItems: 'flex-start' }}>
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src={`${ROOT_URL}/${item.from.avatar}`} />
          </ListItemAvatar>
          <ListItemText
            primary={item.from.login}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body1"
                  className={classes.typografy}
                  color="textSecondary"
                >
                  {item.content}
                </Typography>

                <Typography
                  component="span"
                  variant="caption"
                  className={classes.typografy}
                  color="textPrimary"
                >
                  {item.time}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </div>
  );
};

export default MessageList;
