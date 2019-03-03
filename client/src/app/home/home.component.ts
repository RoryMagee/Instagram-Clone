import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  firstName: String = '';
  secondName: String = '';
  email: String = '';
  username: String = '';
  password = '';
  constructor(private rest: RestApiService, private data: DataService) { }
  
  ngOnInit() {
  }

  validate() {
    return true;
  }

  async register() {
    try {
      if(this.validate()) {
        const data = await this.rest.post(
          environment.url + '/api/users/signup',
          {
            firstName: this.firstName,
            secondName: this.secondName,
            email: this.email,
            username: this.username,
            password: this.password
          }
        );
        if(data['success']) {
          localStorage.setItem('token', data['token']);
          await this.data.getProfile();
        } else {
          console.log(data['message']);
        }
      } 
    } catch (error) {
      console.log(error);
    }
  }
}
