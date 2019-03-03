import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { RestApiService } from './rest-api.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = '';
  user: any;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.message = '';
      }
    });
   }

   async getProfile() {
     try {
       if(localStorage.getItem('token')) {
         const data = await this.rest.get(
           environment.url + '/api/users/user'
         );
         this.user = data['user'];
         console.log(this.user);
       }
     } catch (error) {
       console.log(error);
     }
   }
}
