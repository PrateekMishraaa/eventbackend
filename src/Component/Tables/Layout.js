import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('Pledge');
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/logout');
      if (res.status === 200) {
        localStorage.removeItem('district');
        localStorage.removeItem('state');
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleListItemClick = async (action) => {
    setActiveItem(action);

    if (action === 'Pledge') {
      navigate('/Eventelist');
    } else if (action === 'Poster') {
      navigate('/posterlist');
    } else if (action === 'MUN') {
      navigate('/munlist');
    } else if (action === 'Logout') {
      await logoutHandler();
      console.log('Logging out...');
    }
  };

  const drawerContent = (
    <div>
      <List>
        {['Events',  'Logout'].map((text) => (
          <ListItem
            button
            key={text}
            onClick={() => handleListItemClick(text)}
            style={{
              border: '1.5px ridge',
              marginBottom: '5px',
              backgroundColor: activeItem === text ? '#1976d2' : 'transparent',
              color: activeItem === text ? '#fff' : 'inherit',
            }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{ style: { fontWeight: '800' } }}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: '40px',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
