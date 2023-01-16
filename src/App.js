import React, { Component } from 'react';
import './App.css';


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

  	if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
  		alert("Your browser doesn't support Blobs");
  		return;
  	}

    csvFile = new Blob([csv], {type:"text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleExport = this.handleExport.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleExport(event) {
  const csv = this.state.users.map((item) => {
    return [
       `${item.name.title} ${item.name.first} ${item.name.last}`,
       item.email, item.phone || item.cell,
       item.dob.age, item.gender,
    ];
  });
  csv.unshift(['Name', 'Email', 'Phone', 'Age', 'Gender']);
  downloadCSV(csv.join("\n"), 'users');
  }

  getTableContent = () => {
    const users = this.state.users;
    if (!users.length) return null;
    const iterateItem = (item) => {
       return item.map(function (nextItem, j) {
         return (
            <tr key={nextItem.phone}>
               <td>Name: {nextItem.name.title} {nextItem.name.first} {nextItem.name.last}</td>
               <td>Email: {nextItem.email}</td>
               <td>Phone: {nextItem.phone || nextItem.cell}</td>
               <td>Age: {nextItem.dob.age}</td>
               <td>Gender: {nextItem.gender}</td>
               <td>Picture: <img width="60" height="60" alt={nextItem.name.first} src={nextItem.picture.medium} /></td>
            </tr>
         );
       })
    }
    return (
        <table id="customers">
          <tbody>
            {iterateItem(users)}
          </tbody>
        </table>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    // basic fetch to get users
    fetch('/api/getusers')
      .then(response => response.json())
      .then(users => {
        this.setState({users});
      });
  }

  render() {
    return (
      <div className="App">
        {!!this.state.users.length && <button className="exportButton" onClick={this.handleExport}>Export CSV</button>}
        {!this.state.users.length && <button className="fetchButton" onClick={this.handleSubmit}>Fetch Users</button>}
        <div>{this.getTableContent()}</div>
      </div>
    );
  }
}

export default App;
