import { Injectable, Inject } from '@angular/core';
import { ContractService } from './contract.service';
import Web3 from 'web3';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WEB3 } from '../../core/web3';
import { environment } from '../../../environments/environment.prod';
import { Subject, Observable } from 'rxjs';

declare let require: any;
const jamTokenAbi = require('../../../../../Blockchain/build/contracts/JamToken.json');

@Injectable({
  providedIn: 'root'
})
export class JamTokenService extends ContractService {

  constructor(@Inject(WEB3) protected web3: Web3, protected snackBar: MatSnackBar) {
    super(web3, snackBar);
    this.loadWeb3().then(
      (data: any) => {
        this.loadContractInfo(jamTokenAbi).then(
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

  async approve(targetContractService: ContractService, amount: number): Promise<boolean> {
    let result = false;
    try {
      amount = this.web3js.utils.toWei(amount, 'Ether');
      await this.contract.methods.approve(targetContractService.Address, amount).send({ from: this.accounts[0] })
        .on("transactionHash", (hash) => {
          result = true;
          this.loadedContract$.next(true);
        });
    } catch (error) {
      throw error;
    }
    return await result;
  }

}
