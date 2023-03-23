// SPDX-License-Identifier: MIT

pragma solidity >=0.4.4 <0.7.0;

import "./JamToken.sol";
import "./StellartToken.sol";

// Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Usuario: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

contract TokenFarm {
    // Declaraciones iniciales
    string public name = "Stellart Token Farm";
    address public owner;
    JamToken public jamToken;
    StellartToken public stellartToken;

    // Estructuras de datos
    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => uint) public stakingTimes;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(StellartToken _stellartToken, JamToken _jamToken) public {
        stellartToken = _stellartToken;
        jamToken = _jamToken;
        owner = msg.sender;
    }

    // Stake de tokens
    function stateTokens(uint _amount) public {
        // Se requiere una cantidad superior a 0
        require(_amount > 0, "La cantidad no puede ser un menor a 0");
        // Transferir tokens JAM al Smart contract principal
        jamToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        stakingTimes[msg.sender] = now;
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);            
        }
        // actualizar los valores del staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Quitar el staking de los tokens
    function unstakeTokens() public {
        // Saldo del staking de un usuario
        uint balance = stakingBalance[msg.sender];
        // Se requiere una cantidad superior a 0
        require(balance > 0, "El balance del staking es 0");
        // Transferencia de los tokens al usuario
        jamToken.transfer(msg.sender, balance);
        // resetea el balance de staking del usuario
        stakingBalance[msg.sender] = 0;
        // Actualizar el estado del staking
        isStaking[msg.sender] = false;
    }

    // emisión de Tokens (recompensas)
    function issueTokens() public {
        // unicamente ejecutable por el owner
        require(msg.sender == owner, "No eres el owner");
        uint recompensa = 0;
        // Emitir tokens a todos los stakers
        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];            
            uint balance = stakingBalance[recipient];
            uint stakingTime = stakingTimes[recipient] + 1 minutes;
            if (balance > 0 && now >= stakingTime) {            
                stakingTimes[recipient] = now;
                uint porcentaje = 1;    
                recompensa = (balance * porcentaje) / 100;                
                stellartToken.transfer(recipient, recompensa);
            }
        }
    }

    function isPossibleIssueReward() public view returns (bool) {
        uint stakingTime = stakingTimes[msg.sender] + 1 minutes;
        uint stakingValue = stakingBalance[msg.sender];
        if (stakingValue > 0 && now >= stakingTime) {
            return true;
        } else {
            return false;
        }
    }
}
