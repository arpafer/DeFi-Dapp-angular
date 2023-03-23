import { Injectable, Inject } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { MatSnackBar } from '@angular/material/snack-bar';
import Web3 from 'web3';
import { WEB3 } from '../../core/web3';
import { ContractService } from './contract.service';
import { Observable, Subject } from 'rxjs';
import { JamTokenService } from './jam-token.service';

const tokenFarmAbi = require('../../../../../Blockchain/build/contracts/TokenFarm.json');

@Injectable({
  providedIn: 'root'
})
export class TokenFarmService extends ContractService {

  private JamTokenService: JamTokenService;

  constructor(@Inject(WEB3) protected web3: Web3, protected snackBar: MatSnackBar) {
    super(web3, snackBar);
    this.loadWeb3().then(
      (data: any) => {
        this.loadContractInfo(tokenFarmAbi).then(
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

  async getBalance(): Promise<number> {
    try {
      const balance = await this.contract.methods.stakingBalance(this.accounts[0]).call();
      // this.loadedContract$.next(true);
      return await this.web3js.utils.fromWei(balance, 'Ether');
    } catch (err) {
      throw err;
    }
  }

  async stakeTokens(amount: number): Promise<boolean> {
    let result = false;
    try {
      amount = this.web3js.utils.toWei(amount, 'Ether');
      await this.contract.methods.stateTokens(amount).send({ from: this.accounts[0] })
        .on("transactionHash", (hash) => {
          result = true;
          this.loadedContract$.next(true);
        });
    } catch (error) {
      throw error;
    }
    return await result;
  }

  async unstakeTokens(): Promise<boolean> {
    let result = false;
    try {
      await this.contract.methods.unstakeTokens().send({ from: this.accounts[0] })
        .on("transactionHash", (hash) => {
          result = true;
          this.loadedContract$.next(true);
        });
    } catch (error) {
      throw error;
    }
    return await result;
  }

  async issueTokens(): Promise<boolean> {
    let result = false;
    try {
      await this.contract.methods.issueTokens().send({ from: this.accounts[0] })
        .on("transactionHash", (hash) => {
          result = true;
        });
    } catch (error) {
       throw error;
    }
    return result;
  }

  async isPossibleIssueReward(): Promise<boolean> {
    try {
      const possible = await this.contract.methods.isPossibleIssueReward().call();
      console.log("Tiene recompensa: " + possible);
      return possible;
    } catch (error) {
      throw error;
    }
  }
}
