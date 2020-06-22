import * as React from 'react';
import styles from './SportsScore.module.scss';
import { ISportsScoreProps } from './ISportsScoreProps';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RSlider from "react-slick";
import { Loader } from '../../common/Loading';
import axios from 'axios';

// Functional component for slider.
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#000", right: "0", top: "10px" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style, display: "block", background: "#000", left: "92%", top: "10px", position: "absolute", zIndex: "1"
      }}
      onClick={onClick}
    />
  );
}

export interface ISportsScoreState {
  isLoading: boolean;
  items: [{
    "id": string,
    "title": string
  }]
}

export default class SportsScore extends React.Component<ISportsScoreProps, ISportsScoreState> {

  constructor(props: ISportsScoreProps, state: ISportsScoreState) {
    super(props);
    //Initialize the State
    this.state = {
      isLoading: true,
      items: [{
        "id": "",
        "title": "No matches Today",
      }]
    }
  }

  public componentDidMount() {
    this.LoadData();
  }

  //Load data from the api and set the state
  private LoadData() {
    var reactHandler = this;
    axios.post('https://prod-07.centralindia.logic.azure.com:443/workflows/0e30ba1729fe4b5ba3a6593ac832d31c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AmIdCXHW0nmZtq85S5WiZKEEiJ3O7St9l1BHBKIS95A', {
      url: "http://static.cricinfo.com/rss/livescores.xml"
    })
      .then(function (response) {
        reactHandler.setState({
          items: response.data,
          isLoading: false,
        })
        console.log(response);
      })
      .catch(function (error) {
        console.log("Error fatching the feed.");
        console.log(error);
      });
  }

  public render(): React.ReactElement<ISportsScoreProps> {

    // Settings for the slider
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      focusOnSelect: true,
      pauseOnHover: true
    };

    var teams = [];
    var team1;
    var team2;

    return (
      <div className={ styles.sportsScore }>
        <div className={ styles.container }>
          <h2>Live Cricket Score</h2>
          {
            // Display loading until data is loaded.
            (this.state.isLoading)
              ? <Loader message="Please wait..." />
              :
              <div className={styles.row}>
                <div className={styles.column}>
                  <RSlider {...settings}>
                    {
                      this.state.items.map((item, key) => {
                        // Fatch the team name and team score from discription 
                        teams = [];
                        //Devide the teams and fatch the team name 
                        teams = item.title.split(' v ');
                        team1 = teams[0].split(/[0-9]/)[0];
                        team2 = teams[1].split(/[0-9]/)[0];
                        return (
                          <div key={key}>                            
                            <h3>{`${team1} v/s ${team2}`}</h3>
                            <hr />
                            <div className={styles.scoredetails}>
                            <a href={item.id} target="_blank">{item.title}</a>
                            <div className={styles.details}>
                              {teams[0]}
                            </div>
                            <div className={styles.details}>
                              {teams[1]}
                              </div>
                              </div>
                              
                            
                          </div>
                        )
                      })
                    }
                  </RSlider>
                </div>
              </div>
          }
        </div>
      </div>
    );
  }
}
