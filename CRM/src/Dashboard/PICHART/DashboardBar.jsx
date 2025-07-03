import React from 'react';
import '../../Dashboard/PICHART/DashboardBar.css';
import leaderimg from '../../Images/leaderImg.png'

const data = [
  { name: 'Nimi Martins', dialed: 15, pending: 15, converted: 15, notPicked: 15, notInterested: 15 },
  { name: 'Priya Shah', dialed: 20, pending: 20, converted: 20, notPicked: 20, notInterested: 20 },
  { name: 'Lucas Rivera', dialed: 25, pending: 25, converted: 25, notPicked: 25, notInterested: 25 },
  { name: 'Zara Malik', dialed: 40, pending: 40, converted: 40, notPicked: 40, notInterested: 40 },
];

const leaderboard = [
  { name: 'Sarah Martins', score: 50000, rank: '1st' },
  { name: 'Nimi Martins', score: 2300, rank: '2nd' },
  { name: 'Yomi Ndu', score: 2300, rank: '3rd' },
  { name: 'Akin Siyabola', score: 2300, rank: '4th' },
];


const PieChart = ({ title, data }) => {
  return (
    <div className="DashboardBar-chart-container">
      <h3>{title}</h3>
      <div className="DashboardBar-chart"></div>
      <ul className="DashboardBar-legend">
        {data.map((item, index) => (
          <li key={index} style={{ color: item.color }}>
            {item.name} {item.percentage}%
          </li>
        ))}
      </ul>
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div className="DashboardBar-leaderboard">
      <h3>Leaderboard</h3>
      <div className="DashboardBar-top-sales">
        <h4>Most Sales</h4>
        <img src={leaderimg} alt="" className='leader-img'/>
        <p className="DashboardBar-highlight">Sarah Martins</p>
        <p className="DashboardBar-score">50,000</p>
      </div>
      <ul>
        {leaderboard.slice(1).map((user, index) => (
          <li key={index} className="DashboardBar-leaderboard-item">
            <span>{user.rank}</span>
            <span>{user.name}</span>
            <span>{user.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const DashboardBar = () => {
  return (
    <div className="DashboardBar-dashboard-pi">
      <div className="DashboardBar-charts">
        {['Dialed', 'Pending', 'Converted', 'Not Picked', 'Not Interested'].map((title, index) => (
          <PieChart
            key={index}
            title={title}
            data={data.map(user => ({
              name: user.name,
              percentage: user[title.toLowerCase().replace(' ', '')],
              color: ["#4A90E2", "#FF7F50", "#FFA500", "#FF4500"][index % 4]
            }))}
          />
        ))}
      </div>

     <div>
     <Leaderboard />
     </div>

    </div>
  );
};

export default DashboardBar;