import React from 'react';
import { ListItemAvatar, Avatar, Button } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { ROOT_URL } from '../constanst/url';
import { useAppSelector } from '../hooks/redux';

//типизация--------------------------------
type PropsType = {
  goOut: () => void;
};

//-----------------------------------------

const Logout: React.FC<PropsType> = ({ goOut }) => {
  const { user } = useAppSelector((state) => state.authReducer);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={`${ROOT_URL}/${user.avatar}`} />
      </ListItemAvatar>

      <Button color="inherit" onClick={handleMenu}>
        {user.login}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={goOut}>Выйти</MenuItem>
      </Menu>
    </>
  );
};
export default Logout;
