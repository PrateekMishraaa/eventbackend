import { Backdrop } from '@mui/material';
import React from 'react';
import { Puff } from 'react-loader-spinner';

const LoaderSplash = ({ show, color }) => {
    return (
        <Backdrop className="vh-100" sx={{ color: 'yellow', zIndex: 3000 }} open={show ? show : true}>
            <Puff
                height="80"
                width="80"
                radius={1}
                color={color ? color : 'orange'}
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </Backdrop>
    );
};

export default LoaderSplash;
