import { Injectable, Inject } from '@angular/core';
import Web3 from 'web3';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WEB3 } from '../../core/web3';
import { ContractService } from './contract.service';
import { environment } from '../../../environments/environment.prod';
import { Observable, Subject } from 'rxjs';

const stellarTokenAbi = require('../../../../../Blockchain/build/contracts/StellartToken.json');

@Injectable({
  providedIn: 'root'
})
export class StellartTokenService extends ContractService {
  
  constructor(@Inject(WEB3) protected web3: Web3, protected snackBar: MatSnackBar) {
    super(web3, snackBar);
    this.loadWeb3().then(
      (data: any) => {
        this.loadContractInfo(stellarTokenAbi).then(
          () => {
            this.loadedContract$.next(true);
          }
        );
      }, error => {
        console.warn('Error: ' + error.message);
      }
    );
  }

  protected setNetworkId(): number {
    return environment.NETWORK_ID_GANACHE;
  }

}
