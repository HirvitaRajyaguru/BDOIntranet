import * as React from 'react';
import styles from './PartnersSpeak.module.scss';
import { IPartnersSpeakProps } from './IPartnersSpeakProps';
import { IPartnersSpeakState } from './IPartnersSpeakState';
import { Loader } from '../../common/Loading';
import common from '../../common/common';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link } from 'office-ui-fabric-react';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import ThoughtDisplay from './ThoughtDisplay';

export default class PartnersSpeak extends React.Component<IPartnersSpeakProps, IPartnersSpeakState> {

  constructor(props: IPartnersSpeakProps, state: IPartnersSpeakState) {
    super(props);
    //Initialize the State

    this.state = {
      images: [{
        Image: {
          "Url": "",
          "Description": "",
        }
      }],
      items: [
        {

          Title: 'No Award to Display',
          Description: '',
          ID: 0
        }
      ],
      ReqID: 0,
      isLoading: true,
    };
  }
  public async componentDidMount() {
    await this.getCurrentUserLocation();
  }
  public componentWillReceiveProps(nextProps): void {
    this.getCurrentUserLocation();
  }
  //get user's Current location 
  public async getCurrentUserLocation() {
    //# TODO change Department to serviceline
    const response = await this.props.graphClient.api('/me/department') //get current user's department
      .get((error: any, department: any, rawResponse?: any) => {
        this.props.graphClient.api('/me/city') //get current user's city
          .get((error: any, city: any, rawResponse?: any) => {
            this.getPartnerRecord(department.value, city.value);
          });
      });
  }

  public getPartnerRecord(department, city) {
    var method = 'get items for Global Leadership Thought';
    let newCommonObj: common = new common();
    var query;
    if (this.props.serviceline == undefined)  //serviceline not selected query is fetch alerts acording to current user's sericeline and location
      query = "?$select=*,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + department + "' and TaxCatchAll/Term eq '" + city + "' and Status eq 'Approved'&$expand=TaxCatchAll&$orderby=Modified desc&$top=5";
    else if (this.props.serviceline == "ALL SERVICELINE") //serviceline not selected query is fetch alerts acording to all sericeline and user's location
      query = "?$select=*,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + city + "'and Status eq 'Approved'&$expand=TaxCatchAll&$orderby=Modified desc&$top=5";
    else//serviceline not selected query is fetch alerts acording to selected sericeline and user's location
      query = "?$select=*,TaxCatchAll/Term&$filter=TaxCatchAll/Term eq '" + this.props.serviceline + "' and TaxCatchAll/Term eq '" + city + "' and Status eq 'Approved'&$expand=TaxCatchAll&$orderby=Modified desc&$top=5";

    newCommonObj.getDataFromListUsingGuid(this.props.siteUrl, this.props.listId, query, method).then(async (res) => {
      if (res.data.value.length > 0) {
        //if service line is all then ordring First Your serviceline display after that other
        if (this.props.serviceline == "ALL SERVICELINE") {
          var dataFiltered = res.data.value.filter(
            data => data.ADDepartment[0].Label == department//Filter by your service line
          )
          if (dataFiltered.length > 0) {
            if (dataFiltered.length == res.data.value.length) {//If all filtered data's service line = yur service line
              this.setState({ items: dataFiltered, isLoading: false });
            }
            else {
              var i = 0;
              for (i = 0; i < dataFiltered.length; i++) {
                const index = res.data.value.indexOf(dataFiltered[i]);
                if (index > -1) {
                  res.data.value.splice(index, 1);
                }
              }
              let orderservice = [];
              dataFiltered.forEach(myservice => {
                orderservice.push({
                  "Title": myservice.Title,
                  "Description": myservice.Description,

                });
              });
              res.data.value.forEach(otherservice => {
                orderservice.push({
                  "Title": otherservice.Title,
                  "Description": otherservice.Description,
                });
              });
              var item; item = orderservice;
              this.setState({ items: item, isLoading: false });
            }
          }
          else {
            this.setState({ items: res.data.value, isLoading: false });
          }
        }
        else { this.setState({ items: res.data.value, isLoading: false }); }
      }
      else {
        this.setState({
          items: [{
            "Title": `${this.props.serviceline} 's Thought Leadership's not in your location`,
            "Description": "",
            ID: 0,

          }],
          isLoading: false,
          ReqID: 0
        });
      }

    }).catch(error => {
      console.log(error);
    });
  }



  public render(): React.ReactElement<IPartnersSpeakProps> {
    var queryParameters = new UrlQueryParameterCollection(window.location.href);
    if (parseInt(queryParameters.getValue("RID")) > 0) {
      return (<ThoughtDisplay graphClient={this.props.graphClient}
        siteUrl={this.props.siteUrl}
        listId={this.props.listId}
        serviceline={this.props.serviceline}
        numberOfSeconds={this.props.numberOfSeconds}
      />);
    } else {
      //property of Slider
      var settings = {
        dots: true,
        infinite: true,
        speed: 200,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: Number(this.props.numberOfSeconds + '000'),
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
      };

      // This function return the loading screen or data based on the state IsLoading
      return (
        <div className={styles.partnersSpeak}>
          <div className={styles.container}>

            <div className={styles.header}>
              THOUGHT LEADERSHIP
          </div>
            <div>
              <Slider {...settings}>
                {this.state.items.map(function (item, key) {
                  return (<div>

                    <div className="ms-Grid-row">
                      <div className={styles.title}>
                        {item.Title}
                      </div>
                      <div className={styles.description}>
                        {item.Description}
                      </div>

                      <Link
                        href={`/sites/BDOIntranet/SitePages/ThoughtLeadership.aspx?RID=${item.ID}`}
                        data-interception="off" target="_blank" rel="noopener noreferrer"
                        className={styles.viewAll}
                      >Read More
                  </Link>
                    </div>
                  </div>)

                })}
              </Slider>
            </div>

          </div>

        </div>
      );
    }
  }
}
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black", right: "0", top: "10px" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style, display: "block", background: "black", left: "92%", top: "10px", position: "absolute", zIndex: "1"
      }}
      onClick={onClick}
    />
  );
}

