import { Component, OnInit } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ContractService } from '../../services/contract/contract.service';
import { JamTokenService } from '../../services/contract/jam-token.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  menuItems = ['Home', 'Transaction'];
  public accountNumber: string;

  constructor(private contractService: JamTokenService) {

  }

  ngOnInit(): void {
    this.contractService.loadWeb3().then(
      (loaded) => {
        this.accountNumber = this.contractService.getAccountNumber();
        this.accountNumber = this.accountNumber.slice(0, 10) + '...' + this.accountNumber.slice(32, 42);
      });
  }

  // constructor(private breakpointObserver: BreakpointObserver) { }

}
