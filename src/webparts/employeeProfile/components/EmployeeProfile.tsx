import * as React from 'react';
import styles from '../components/EmployeeProfile.module.scss';
import { IEmployeeProfileProps } from './IEmployeeProfileProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jsPDF from "jspdf"; //npm install jspdf@1.4.1 --save, npm i @types/jspdf --save use in same sequence
import html2canvas from "html2canvas"; //npm i  html2canvas --save use this to install
import axios, { AxiosRequestConfig } from "axios"; //npm i axios use this to install
import {
  SPHttpClient,
  SPHttpClientResponse,
  SPHttpClientConfiguration,
  ISPHttpClientOptions
} from "@microsoft/sp-http";
import pnp, { CheckinType, Web, Logger, HttpClient } from "sp-pnp-js";
require("./tablestyle.css");

let siteUrl = "https://synoverge.sharepoint.com/sites/BDO-QA/";

let web = new Web(siteUrl);

export default class EmployeeProfile extends React.Component<IEmployeeProfileProps, {}> {
  constructor(props) {
    super(props);
  }
  public render(): React.ReactElement<IEmployeeProfileProps> {
    return (
      <div>
        <div id="mypdf">
          <br />
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Country</th>
              </tr>
              <tr>
                <td>Madhan Thurai</td>
                <td>Chennai</td>
                <td>India</td>
              </tr>
              <tr>
                <td>Reghu</td>
                <td>Madurai</td>
                <td>India</td>
              </tr>
              <tr>
                <td>Ananth</td>
                <td>Nagercoil</td>
                <td>India</td>
              </tr>
              <tr>
                <td>Vanitha</td>
                <td>Cuddalore</td>
                <td>India</td>
              </tr>
              <tr>
                <td>Boopathi</td>
                <td>Dindigul</td>
                <td>India</td>
              </tr>
              <tr>
                <td>Risha</td>
                <td>Tirunelveli</td>
                <td>India</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={this.PrintDocument}>Generate Pdf </button>
      </div>
    );
  }

  public PrintDocument() {
    const myinput = document.getElementById("mypdf");
    const mynewpdf = new jsPDF("p", "mm", "a4");
    html2canvas(myinput).then(canvas => {
      var imgWidth = 200;
      var pageHeight = 290;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      const imgData = canvas.toDataURL("image/png");

      var position = 0;
      mynewpdf.addImage(imgData, "JPEG", 5, position, imgWidth, imgHeight);
      web
        .getFolderByServerRelativeUrl(
          "/sites/BDO-QA/Shared%20Documents"
        )
        .files.add("test.pdf", mynewpdf.output("arraybuffer"), true)
    });

    location.href = 'http://www.google.com';
  }
}
