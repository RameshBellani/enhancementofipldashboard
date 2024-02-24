import { useState, useEffect } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import { Link, useParams } from 'react-router-dom';
import LatestMatch from '../LatestMatch';
import MatchCard from '../MatchCard';
import PieChart from '../PieChart';
import './index.css';

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/';

const TeamMatches = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [teamMatchesData, setTeamMatchesData] = useState({});

  useEffect(() => {
    const getFormattedData = (data) => ({
      umpires: data.umpires,
      result: data.result,
      manOfTheMatch: data.man_of_the_match,
      id: data.id,
      date: data.date,
      venue: data.venue,
      competingTeam: data.competing_team,
      competingTeamLogo: data.competing_team_logo,
      firstInnings: data.first_innings,
      secondInnings: data.second_innings,
      matchStatus: data.match_status,
    });

    const getTeamMatches = async () => {
      try {
        const response = await fetch(`${teamMatchesApiUrl}${id}`);
        const fetchedData = await response.json();
        const formattedData = {
          teamBannerURL: fetchedData.team_banner_url,
          latestMatch: getFormattedData(fetchedData.latest_match_details),
          recentMatches: fetchedData.recent_matches.map((eachMatch) =>
            getFormattedData(eachMatch)
          ),
        };
        setTeamMatchesData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching team matches:', error);
      }
    };

    getTeamMatches();
  }, [id]);

  const getNoOfMatches = (value) => {
    const { latestMatch, recentMatches } = teamMatchesData;
    const currentMatch = value === latestMatch.matchStatus ? 1 : 0;
    const result =
      recentMatches.filter((match) => match.matchStatus === value).length +
      currentMatch;
    return result;
  };

  const generatePieChartData = () => [
    { name: 'Won', value: getNoOfMatches('Won') },
    { name: 'Lost', value: getNoOfMatches('Lost') },
    { name: 'Drawn', value: getNoOfMatches('Drawn') },
  ];

  const renderRecentMatchesList = () => {
    const { recentMatches } = teamMatchesData;

    return (
      <ul className="recent-matches-list mb-0">
        {recentMatches.map((recentMatch) => (
          <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
        ))}
      </ul>
    );
  };

  const renderTeamMatches = () => {
    const { teamBannerURL, latestMatch } = teamMatchesData;

    return (
      <div className="responsive-container">
        <img
          src={teamBannerURL}
          alt="team banner"
          className="team-banner"
        />
        <LatestMatch latestMatchData={latestMatch} />
        <h1 className="latest-match-heading mt-3">
          Team Statistics
        </h1>
        <PieChart data={generatePieChartData()} />
        {renderRecentMatchesList()}
        <Link to="/">
          <button
            type="button"
            className="btn btn-outline-info mb-2"
          >
            Back
          </button>
        </Link>
      </div>
    );
  };

  const getRouteClassName = () => {
    switch (id) {
      case 'RCB':
        return 'rcb';
      case 'KKR':
        return 'kkr';
      case 'KXP':
        return 'kxp';
      case 'CSK':
        return 'csk';
      case 'RR':
        return 'rr';
      case 'MI':
        return 'mi';
      case 'SH':
        return 'srh';
      case 'DC':
        return 'dc';
      default:
        return '';
    }
  };

  const className = `team-matches-container ${getRouteClassName()}`;

  return (
    <div className={className}>
      {isLoading ? (
        <div testid="loader" className="loader-container">
          <ThreeCircles type="Oval" color="#ffffff" height={50} />
        </div>
      ) : (
        renderTeamMatches()
      )}
    </div>
  );
};

export default TeamMatches;
