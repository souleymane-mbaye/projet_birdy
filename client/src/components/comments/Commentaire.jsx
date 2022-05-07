import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function Commentaire({com}) {
  return (
      
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        
        <ListItemText
          
          secondary={
            <React.Fragment>
              <Typography
                variant="body2"
                color="text.primary"
              >
                <Link to={`/profile/${com.user_id}`} style={{ textDecoration: "none", color: "black"}}>
                    <b>{com.user_login}:</b>
                </Link>
              </Typography>
              {com.comment}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      
    </List>
  );
}
