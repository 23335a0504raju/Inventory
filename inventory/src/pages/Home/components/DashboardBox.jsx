import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PropTypes from 'prop-types';
import React from 'react';

const DashboardBox = ({ color, icon, grow, value, text }) => { 
  return (
    <div className="dashboardBox" 
      style={{
        backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`
      }}
    >

   
      <div className="chart">
        {grow ? <TrendingUpIcon /> : <TrendingDownIcon />}
      </div>

      <div className='d-flex w-100'>
        <div className='col1'>
          <h4 className='text-white mb-0'>{text}</h4>
          <span className='text-white'>{value}</span>
        </div>

        
        <div className="col2 px-2 mt-auto" style={{ fontSize: "10px" }}>
          <h4 className="text-white mb-0" style={{marginTop:"150%"}}>{text}</h4>
        </div>

        {icon && (
          <div className='ml-auto'>
            <span className='icon'>
              {icon} 
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


DashboardBox.propTypes = {
  color: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.element,
  grow: PropTypes.bool, 
};

DashboardBox.defaultProps = {
  icon: null,
  grow: false,
};

export default DashboardBox;
