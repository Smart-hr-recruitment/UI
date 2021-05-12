import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'UI';

  apiResponse: string;

  constructor(private msalService: MsalService, private httpCLient: HttpClient) {

  }
  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise().then( res => {
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account)
      }
    });
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null;
  }

  login() {
    // this.msalService.loginRedirect();
    this.msalService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account);
      });
  }

  logout() {
    this.msalService.logout();
  }

  getName(): string {
    if(this.msalService.instance.getActiveAccount() == null) {
      return 'Unknown';
    }
    return this.msalService.instance.getActiveAccount().name;
  }

  getUsers() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/users').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  getSubordinates() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/me/directReports').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  callProfile() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/me').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  callMySkills() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/me/?$select=displayName,skills').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  callMessages() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/me/messages').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  callJoinedTeams() {
    this.httpCLient.get('https://graph.microsoft.com/v1.0/me/joinedTeams').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

  getBackendsApi() {
    this.httpCLient.get('http://localhost:8000/api/v1/smarthr').subscribe(res => {
      this.apiResponse = JSON.stringify(res);
    });
  }

}
