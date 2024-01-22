import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default function CustomizedProgressBars(props) {
    const {mixProgress, highlightStyle, mixMatch} = props;
    console.log(mixProgress, "mixProgress in progress");
    console.log(mixMatch, "mixMatch in progress");

  return (
    <Box sx={{ flexGrow: 1 }}>
        <p style={{ textAlign: "center" }}>Mix & Match Discount Progress</p>
      <BorderLinearProgress variant="determinate" value={mixProgress < 100 ? mixProgress : 100} />
    </Box>
  );
}