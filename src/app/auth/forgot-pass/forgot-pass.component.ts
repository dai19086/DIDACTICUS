import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css']
})
export class ForgotPassComponent {

  email : string = '';
  sent : boolean = false;

  constructor (private auth : AuthService) { }

  ngOnInit(): void {
    this.email = '';
    this.sent = false;
  }

  async forgotPass(){
    const awaitSent = await this.auth.forgotPass(this.email);
    this.sent = awaitSent;
    this.email = '';
  }

}
