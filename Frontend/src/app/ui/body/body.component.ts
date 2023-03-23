import { Component, OnInit, OnDestroy } from '@angular/core';
import { JamTokenService } from '../../services/contract/jam-token.service';
import { Observable, Subscription } from 'rxjs';
import { StellartTokenService } from '../../services/contract/stellart-token.service';
import { TokenFarmService } from '../../services/contract/token-farm.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit, OnDestroy {

  public stellartTokenBalance: number;
  public tokenFarmBalance: number;
  public jamTokenBalance: number;
  private loadedStellartTokenContract$: Observable<boolean> = new Observable<boolean>();
  private loadedFarmTokenContract$: Observable<boolean> = new Observable<boolean>();
  private loadedJamTokenContract$: Observable<boolean> = new Observable<boolean>();
  private stellarTokenSubscription$: Subscription = new Subscription();
  private farmTokenSubscription$: Subscription = new Subscription();
  private jamTokenSubscription$: Subscription = new Subscription();

  public jamTokenValue: number;
  public loading: boolean;

  constructor(private stellartTokenService: StellartTokenService,
              private tokenFarmService: TokenFarmService,
              private jamTokenService: JamTokenService) { }

  ngOnInit(): void {
    this.jamTokenValue = 0;
    this.loadedStellartTokenContract$ = this.stellartTokenService.getLoaded$();
    this.loadedFarmTokenContract$ = this.tokenFarmService.getLoaded$();
    this.loadedJamTokenContract$ = this.jamTokenService.getLoaded$();
    this.loadStellartToken();
    this.loadBalanceFarmToken();
    this.loadJamToken();
    // this.checkRecompensa();
  }

  clickStake(): void {
    if (this.jamTokenValue > 0) {
      this.loading = true;
      this.jamTokenService.approve(this.tokenFarmService, this.jamTokenValue)
        .then(
          (done: boolean) => {
            this.tokenFarmService.stakeTokens(this.jamTokenValue)
              .then(
                () => {
                  this.loading = false;
                  this.jamTokenService.refreshTokens();
                  this.stellartTokenService.refreshTokens();
                }
              ).catch((error) => {
                this.loading = false;
                alert("ERROR Stake tokenFarm: " + error.message);
              });
          }
        ).catch((error) => {
          this.loading = false;
          alert("ERROR Stake jamToken: " + error.message);
        });
    }
  }

  clickUnStake(): void {
    this.loading = true;
    this.tokenFarmService.unstakeTokens().then(
      (done: boolean) => {
        this.loading = false;
      }
    ).catch((error) => {
      this.loading = false;
      alert("ERROR UNSTAKE: " + error.message);
    });
  }

  public loadStellartToken(): void {
    this.stellarTokenSubscription$ = this.loadedStellartTokenContract$.subscribe(
      loaded => {
        this.stellartTokenService.getBalance().then(
          (value: number) => {
            this.stellartTokenBalance = value;
            console.log("Value stellarToken: " + value);
          }
        ).catch((error) => {
          alert("ERROR: " + error.message);
        });
      });
  }

  public loadBalanceFarmToken(): void {
    this.farmTokenSubscription$ = this.loadedFarmTokenContract$.subscribe(
      loaded => {
        this.tokenFarmService.getBalance().then(
          (value: number) => {
            console.log("Value tokenFarm: " + value);
            this.tokenFarmBalance = value;
          }
        ).catch((error) => {
          alert("ERROR: " + error.message);
        });
      });
  }

  private checkRecompensa(): void {
    setInterval(() => {
      this.tokenFarmService.isPossibleIssueReward().then(
        (possible: boolean) => {
          if (possible === true) {
            this.loading = true;
            this.tokenFarmService.issueTokens().then(
              (done) => {
                this.loading = false;
                this.jamTokenService.refreshTokens();
                this.tokenFarmService.refreshTokens();
              }
            ).catch((error) => {
              this.loading = false;
            });
          }
        }
      ).catch((error) => {
        alert("ERROR issueTokens: " + error.message);
      });
    }, 10000);
  }

  public loadJamToken(): void {
    this.jamTokenSubscription$ = this.loadedJamTokenContract$.subscribe(
      loaded => {
        this.jamTokenService.getBalance().then(
          (value: number) => {
            this.jamTokenBalance = value;
            console.log("Value JamToken: " + value);
          }
        ).catch((error) => {
          alert("ERROR: " + error.message);
        });
      });
  }

  ngOnDestroy(): void {
    this.farmTokenSubscription$.unsubscribe();
    this.jamTokenSubscription$.unsubscribe();
    this.stellarTokenSubscription$.unsubscribe();
  }
}
