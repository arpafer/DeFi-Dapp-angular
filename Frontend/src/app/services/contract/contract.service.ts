import {Inject, Injectable} from '@angular/core';
import { WEB3 } from '../../core/web3';
//import contract from 'truffle-contract'; //acceso a libreria deprecada
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Observable } from 'rxjs';

import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

declare let require: any;
declare let window: any;

@Injectable({
  providedIn: 'root'
})

export abstract class ContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
  web3js;
  provider;
  accounts;
  balance;
  private address: string;
  protected mainAccount: string;
  protected contract: any;
  protected jsonAbi: any;
  protected loadedContract$: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(WEB3) protected web3: Web3, protected snackbar: MatSnackBar) {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "development", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }


  protected async connectAccount() {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    return this.accounts;
  }

  async loadWeb3() {
    if (window.ethereum) {
      this.web3js = window.web3 = new Web3(window.ethereum);
      this.accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Accounts: ', this.accounts[0]);
    }
    else if (window.web3) {
      this.web3js = window.web3 = new Web3(window.web3.currentProvider);
      this.accounts = await this.web3js.eth.getAccount();
    }
    else {
      window.alert('¡Deberías considerar usar Metamask!');
    }
  }

  getAccountNumber(): string {
     return this.accounts[0];
  }

  async accountInfo(accounts){
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
    return this.balance;
  }

  protected async loadContractInfo(contractAbi) {
    console.log("contractAbi: " + contractAbi);
    const networkId: number = this.setNetworkId();
    const networkData = contractAbi.networks[networkId];
    console.log("NetworkId: " + networkId + " networkData: " + networkData);
    if (networkData) {
      console.log("En loadContractInfo");
      this.jsonAbi = contractAbi.abi;
      this.address = networkData.address;
      this.contract = new this.web3.eth.Contract(this.jsonAbi, this.address);
      console.log("address Contract: " + this.address + " contract: " + this.contract);
    }
  }

  get Address(): string { return this.address; }

  protected abstract setNetworkId(): number;
/*
  trasnferEther(originAccount, destinyAccount, amount) {
    const that = this;

    return new Promise((resolve, reject) => {
      var contract = require("@truffle/contract"); // acceso a nueva version de libreria
      const paymentContract = contract(tokenAbi);
      paymentContract.setProvider(this.provider);
      paymentContract.deployed().then((instance) => {
        let finalAmount =  this.web3.utils.toBN(amount)
        console.log(finalAmount)
        return instance.nuevaTransaccion(
          destinyAccount,
          {
            from: originAccount[0],
            value: this.web3.utils.toWei(finalAmount, 'ether')
          }
          );
      }).then((status) => {
        if (status) {
          return resolve({status: true});
        }
      }).catch((error) => {
        console.log(error);

        return reject('Error transfering Ether');
      });
    });
  }*/

  getLoaded$(): Observable<boolean> {
    return this.loadedContract$.asObservable();
  }

  async getBalance(): Promise<number> {
    try {
      const balance = await this.contract.methods.balanceOf(this.accounts[0]).call();
      // this.loadedContract$.next(true);
      return await this.web3js.utils.fromWei(balance, 'Ether');
    } catch (err) {
      throw err;
    }
  }

  refreshTokens(): void {
    this.loadedContract$.next(true);
  }

  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.dismiss();
  }

  success() {
    const snackbarRef = this.snackbar.open('Transaction complete successfully');
    snackbarRef.dismiss();
  }
}
