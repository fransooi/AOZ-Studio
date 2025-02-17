/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * AMAL, a transpiler in a transpiled application! :)
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

var AMALTokens =
{
	'AU': { abbreviation: 'AU', token: 'AUtotest', params: [ 'I' ], compile: [ '#handleAutotest'], newBlock: false },
	'DB': { abbreviation: 'DB', token: 'DeBug', params: [ 'I' ], compile: [ 'debugger'], newBlock: false },
	'PL': { abbreviation: 'PL', token: 'PLay', params: [ 'I0' ], compile: [ '#handlePlay' ], newBlock: false },
	'BC': { abbreviation: 'BC', token: 'Bob Col', params: [ '00,0,0' ], compile: [ 'this.amal.bobCol(%$P0,%$P1,%$P2)' ] },
	'SC': { abbreviation: 'SC', token: 'Sprite Col', params: [ '00,0,0' ], compile: [ 'this.amal.spriteCol(%$P0,%$P1,%$P2)' ] },
	'VU': { abbreviation: 'VU', token: 'VU meter', params: [ '00' ], compile: [ 'this.amal.vuMeter(%$P0)' ] },
	'XH': { abbreviation: 'XH', token: 'X Hard', params: [ '00,0' ], compile: [ 'this.aoz.xHard(%$P1,%$P0)' ] },
	'YH': { abbreviation: 'YH', token: 'Y Hard', params: [ '00,0' ], compile: [ 'this.aoz.yHard(%$P1,%$P0)' ] },
	'XM': { abbreviation: 'XM', token: 'X Mouse', params: [ '0' ], compile: [ 'this.aoz.xMouse' ] },
	'YM': { abbreviation: 'YM', token: 'Y Mouse', params: [ '0' ], compile: [ 'this.aoz.yMouse' ] },
	'XS': { abbreviation: 'XS', token: 'X Screen', params: [ '00,0' ], compile: [ 'this.aoz.xScreen(%$P1,%$P0)' ] },
	'YS': { abbreviation: 'YS', token: 'Y Screen', params: [ '00,0' ], compile: [ 'this.aoz.yScreen(%$P1,%$P0)' ] },
	'J0': { abbreviation: 'J0', token: 'Joystick 0', params: [ '0' ], compile: [ 'this.aoz.joy(0)' ] },
	'J1': { abbreviation: 'J1', token: 'Joystick 1', params: [ '0' ], compile: [ 'this.aoz.joy(1)' ] },
	'K1': { abbreviation: 'K1', token: 'mouseKey 1', params: [ '0' ], compile: [ '((this.aoz.mouseButtons&0b001)!=0)' ] },
	'K2': { abbreviation: 'K2', token: 'mouseKey 2', params: [ '0' ], compile: [ '((this.aoz.mouseButtons&0b010)!=0)' ] },
	'R0': { abbreviation: 'R0', token: 'R0', params: '0', compile: [ 'this.amal.registers["0"]' ], register: '0' },
	'R1': { abbreviation: 'R1', token: 'R1', params: '0', compile: [ 'this.amal.registers["1"]' ], register: '1' },
	'R2': { abbreviation: 'R2', token: 'R2', params: '0', compile: [ 'this.amal.registers["2"]' ], register: '2' },
	'R3': { abbreviation: 'R3', token: 'R3', params: '0', compile: [ 'this.amal.registers["3"]' ], register: '3' },
	'R4': { abbreviation: 'R4', token: 'R4', params: '0', compile: [ 'this.amal.registers["4"]' ], register: '4' },
	'R5': { abbreviation: 'R5', token: 'R5', params: '0', compile: [ 'this.amal.registers["5"]' ], register: '5' },
	'R6': { abbreviation: 'R6', token: 'R6', params: '0', compile: [ 'this.amal.registers["6"]' ], register: '6' },
	'R7': { abbreviation: 'R7', token: 'R7', params: '0', compile: [ 'this.amal.registers["7"]' ], register: '7' },
	'R8': { abbreviation: 'R8', token: 'R8', params: '0', compile: [ 'this.amal.registers["8"]' ], register: '8' },
	'R9': { abbreviation: 'R9', token: 'R9', params: '0', compile: [ 'this.amal.registers["9"]' ], register: '9' },
	'RA': { abbreviation: 'RA', token: 'RA', params: '0', compile: [ 'this.amal.amal.registers["A"]' ], register: 'A' },
	'RB': { abbreviation: 'RB', token: 'RB', params: '0', compile: [ 'this.amal.amal.registers["B"]' ], register: 'B' },
	'RC': { abbreviation: 'RC', token: 'RC', params: '0', compile: [ 'this.amal.amal.registers["C"]' ], register: 'C' },
	'RD': { abbreviation: 'RD', token: 'RD', params: '0', compile: [ 'this.amal.amal.registers["D"]' ], register: 'D' },
	'RE': { abbreviation: 'RE', token: 'RE', params: '0', compile: [ 'this.amal.amal.registers["E"]' ], register: 'E' },
	'RF': { abbreviation: 'RF', token: 'RF', params: '0', compile: [ 'this.amal.amal.registers["F"]' ], register: 'F' },
	'RG': { abbreviation: 'RG', token: 'RG', params: '0', compile: [ 'this.amal.amal.registers["G"]' ], register: 'G' },
	'RH': { abbreviation: 'RH', token: 'RH', params: '0', compile: [ 'this.amal.amal.registers["H"]' ], register: 'H' },
	'RI': { abbreviation: 'RI', token: 'RI', params: '0', compile: [ 'this.amal.amal.registers["I"]' ], register: 'I' },
	'RJ': { abbreviation: 'RJ', token: 'RJ', params: '0', compile: [ 'this.amal.amal.registers["J"]' ], register: 'J' },
	'RK': { abbreviation: 'RK', token: 'RK', params: '0', compile: [ 'this.amal.amal.registers["K"]' ], register: 'K' },
	'RL': { abbreviation: 'RL', token: 'RL', params: '0', compile: [ 'this.amal.amal.registers["L"]' ], register: 'L' },
	'RM': { abbreviation: 'RM', token: 'RM', params: '0', compile: [ 'this.amal.amal.registers["M"]' ], register: 'M' },
	'RN': { abbreviation: 'RN', token: 'RN', params: '0', compile: [ 'this.amal.amal.registers["N"]' ], register: 'N' },
	'RO': { abbreviation: 'RO', token: 'RO', params: '0', compile: [ 'this.amal.amal.registers["O"]' ], register: 'O' },
	'RP': { abbreviation: 'RP', token: 'RP', params: '0', compile: [ 'this.amal.amal.registers["P"]' ], register: 'P' },
	'RQ': { abbreviation: 'RQ', token: 'RQ', params: '0', compile: [ 'this.amal.amal.registers["Q"]' ], register: 'Q' },
	'RR': { abbreviation: 'RR', token: 'RR', params: '0', compile: [ 'this.amal.amal.registers["R"]' ], register: 'R' },
	'RS': { abbreviation: 'RS', token: 'RS', params: '0', compile: [ 'this.amal.amal.registers["S"]' ], register: 'S' },
	'RT': { abbreviation: 'RT', token: 'RT', params: '0', compile: [ 'this.amal.amal.registers["T"]' ], register: 'T' },
	'RU': { abbreviation: 'RU', token: 'RU', params: '0', compile: [ 'this.amal.amal.registers["U"]' ], register: 'U' },
	'RV': { abbreviation: 'RV', token: 'RV', params: '0', compile: [ 'this.amal.amal.registers["V"]' ], register: 'V' },
	'RW': { abbreviation: 'RW', token: 'RW', params: '0', compile: [ 'this.amal.amal.registers["W"]' ], register: 'W' },
	'RX': { abbreviation: 'RX', token: 'RX', params: '0', compile: [ 'this.amal.amal.registers["X"]' ], register: 'X' },
	'RX': { abbreviation: 'RX', token: 'RX', params: '0', compile: [ 'this.amal.amal.registers["X"]' ], register: 'X' },
	'RY': { abbreviation: 'RY', token: 'RY', params: '0', compile: [ 'this.amal.amal.registers["Y"]' ], register: 'Y' },
	'RZ': { abbreviation: 'RZ', token: 'RZ', params: '0', compile: [ 'this.amal.amal.registers["Z"]' ], register: 'Z' },
	'M': { abbreviation: 'M', token: 'Move', params: [ 'I0,0,0' ], compile: [ 'return{type:2,instruction:"move",args:[%$P0,%$P1,%$P2]};' ], waiting: true, newBlock: true },
	'A': { abbreviation: 'A', token: 'Anim', params: [ '0', 'I'  ], compile: [ 'this.amal.registers.a', '#handleAnim' ], newBlock: false, register: 'a', channelRegister: true, toUpdate: 0b100 },
	'J': { abbreviation: 'J', token: 'Jump', params: [ 'J' ], compile: [ '#handleJump' ], autotest: true },
	'L': { abbreviation: 'L', token: 'Let', params: [ 'I' ], compile: [ '#handleLet' ], newBlock: false, autotest: true },
	'I': { abbreviation: 'I', token: 'I', params: [ 'I' ], compile: [ '#handleIf' ], autotest: true },
	'F': { abbreviation: 'F', token: 'For', params: [ 'I' ], compile: [ '#handleFor'], newBlock: true },
	'T': { abbreviation: 'T', token: 'To', params: [ 'I' ], compile: [], newBlock: false },
	'N': { abbreviation: 'N', token: 'Next', params: [ 'I' ], compile: [ '#handleNext' ], newBlock: true },
	'D': { abbreviation: 'D', token: 'Direct', params: [ 'I' ], compile: [ '#handleDirect' ], newBlock: false, autotest: true },
	'E': { abbreviation: 'E', token: 'End', params: [ 'I' ], compile: [ 'return{type:0};' ], newBlock: true },
	'X': { abbreviation: 'X', token: 'eXit', params: [ '0', 'I' ], compile: [ 'this.amal.registers.x', '#handleExit' ], newBlock: true, register: 'x', channelRegister: true, toUpdate: 0b001, autotest: true },
	'O': { abbreviation: 'O', token: 'On', params: [ 'I' ], compile: [ 'this.amal.wait=false;' ], newBlock: true, autotest: true },
	'P': { abbreviation: 'P', token: 'Pause', params: [ 'I' ], compile: [ '' ], newBlock: true, autotest: true },
	'W': { abbreviation: 'W', token: 'Wait', params: [ 'I' ], compile: [ 'this.amal.wait=true;' ], newBlock: true, autotest: true },
	'Z': { abbreviation: 'Z', token: 'Zrandom', params: [ '00' ], compile: [ 'this.amal.z(%$P0)' ] },
	'E': { abbreviation: 'E', token: 'End', params: [ 'I' ], compile: [ 'return{type:0};' ], newBlock: true },
	'Y': { abbreviation: 'Y', token: 'Y', params: '0', compile: [ 'this.amal.registers.y' ], register: 'y', toUpdate: 0b010, channelRegister: true },
	'C': { abbreviation: 'C', token: 'Col', params: [ '00' ], compile: [ 'this.amal.collisions' ] },
};

var i3 = 'z80GAIdhDkrzc/ANlnMVF1b7AtCtj6S41E828FBUvjZ8Ho21TCaIS/0VLBY+v9+3bvWatZ8ul1x2goInCIg47XY7eWvPN5+vWb2s2u8PNPrlyeUNVujjheg8Z3/QL/Vy9XmjfQfbsAr5OtYttOJGj6SBbqMVCx3kWQvo8aAbq5PDZx40xE8Q+QPNzJdf4anc/vPaVT/+WFJQwD82ViQFJSUlP+7fvDZwlaDSU+Gp8uGz5PJT1nN+Kjx7CC7U/5VS2eX5BidcQylwOR4GJqMIuhjh6SpKmigiBTMTQYeuDhmra98GwkZPgviQNVVYF1++x7Oksmj1mh27dm/es/KtEuKUApxOQkRROb2k/j+pR3KXr/hiz+bduzfsWL96e2X9I+P5xT58gfI66zlbSwu93tLCo1sPehESUsaAXl2Hqy/QsREwWFYfBm4BBokvIQVksnGDPTolgw59qSWOqyB8zJUQH3FNMdYvLzAb3e+v+r563bL3P/n568/X/vLpnpUrlpcgUbqQiEqWr1i559Nfvln7+dc/f7J62bJ11d8X+/07d/ry8rCS2n3Wc97Z+juRjn77jvVofTVanGwBnTrbsBr3owAPy0E+19B9vOKOYwxwyFB8l11XO0eX9pjCFj4lDupEaLrc9T6spXLxYqysCOf5qjyeioqKJUuWLK2s3Biw/byNAZWVSwP/riLA46mqTzFdWeXH1otsK+W8whGrEOgGL9a3GU5p9E8FbeNmq4SQQ/J4pCDlOWD3oHyJ1KAhPldEfAo0A1320YG6X8vZlu3igKr8/1UF/snn8+VhHWpOWi/y2dnjwtxpoM9YB1ZjexwCrnJjNY4bQNtrSquq0KkncEhaSIJc7XtfTitx3BhGr3pDxiIB8amfPkpV9t+ntBOLcdOo/cHa2OljXvQf5xjQZ7BDvUc0GgLaUip3j4C2MUrFUnFmJPDo70QKZhg0e0QOm3nQ9Sa5eANdPx+aZvHJOmvA4XLcNDb9dtH6/EchOsOeA7rc4NYsNLdTj7ytA2jql6IU6P4xwCPHrvTF+hjUhRXXBcKHZRRBnN56nxro2j+3WOvVNVWgPzplvcDbx5GXc+JMhOpV0fPf3rbqv6UdsaBphqRYOzZwVSLPAKOIdOohYTqEkZ6dBMRpxTJMUXZyr/U/+2pxkyjbtNfawDtHSCE6T0o2aFqS+57/U9BOPfTZI/kC7XzSyEDPAkZdErA6OaxKHDBlNnegVy6j7jf+r6FtaaI9dM2fDfbO3x53lnovuDWaBTpcb8NqHF3grLHqMbClc67QCwwMtDiLfbzqpVLiAJhBEK/X11HyvPTccrmliVboxQfO7jS2HTl4TCj0NupsmAfsessyS8PzA2o5YNl2ZqWgxiiPDvAco4uPAZsODkwrcYTNVe8zjRwi4rWqGqspq95ibfJAH94WiPLRRai01KsQlVExwKydG6uRuzBdkbY9CBr6KVY5RsUDjwVKy704wIDhX1gOn5uE9WImEv5A78TK5MU7G5zZ7SvHTcK/p7C0tLSwUECKMkcDqzbZWI18ZQScd7uN/y3OqYqne5nTgMd8ohToLMaKTjamiOsA4SRmYRArtB8rqzm33zC6ysF/kUAYPxBYjXBgNdmPXhAFmb9/+DnFQPfqDhwSeyEFJIN9+BftM3BYieLPs7jZr3Zit8XawKGmCXTxehHRpLwJjLoOxmrk9hHQQCrlPc6rewPVwPGC8nE1h7TZil9rHFsN2nbplDgAniOIF9mtHOjyQJ4b+rVJAl1UsVZCNGSuAc8gO+6GC9zi4H4uOUp5Ve0DHLJSlALN+DsplnrVO7xKHAB97PyB3qAUaLn2RKMWoe9qcRPI03osgDA33LW3qXeGNt5tx2E18gO9NQZqiIozZkC/mHkiUpAZxfgG4yUxD/qsHP5ASzuUAl373V7rhU42SR06/ys7oiIvMgb6CjfraAp6i5Lcg6PLURQjQbfITMVAT4gHbRG3U3ccfcNnuMwZoyTESZDW+BXa6/5p3ML5XnkZbgJLNkuIisxkC3TEcBtW074tNNLbpt7o3w2onlJsorE/xrVv5D51vCIbUyRcA2FmOuEP9FeNAy2X1R6yNlb3EW4CeRtLEJ04PQZYdM7Gamx94SJ3Ue4B3Ac0r7kEg5456q94SXbRY6AtOpZa4hgKYWZaLuImfVncuFv0hzrrRf7eJGPz+XcUIA25UcG2JWUrrFdtruZ9LjkyV1TM4VzQaZyk/F7SOJYaNL3EEUY3Cc8Y6ELcxI0+3FB5+eGPrRc7UI7NF3jFFtGw36fuQCktD1F8pZLyA9CDZ7s3IRJ0sSg3Q5NBFqYHNy6lEkcw3f1ILKnMw+fVlAc+DSp470QNNp/v/eVIi9QPGAx1UE699Z6zpUcAxWPKgSb9QJcM5bEqdpYt9C1uTJEQdgs0zOUPNNm/qbamDAeU1dSWn/ytzqpoXzU2XxHLe4iuPqCti033PZTBlPPvNhyjk8j0RCOmUEgZoKkr/WZsu3ArcQA84+IOdOGxugNLP6q3yX/g1N73rMpO1cjYdL7KEhFpsU8KboF2jARFPRyct/8jJyBFUn/QYZ5d5TNwfJDDv7A77EocAJPt3IEu/am+k+7UoUN1W6wUf9dg83k+oP5/sP8O7hCHVcXeCsq6qS/RcluOkVVePZNws1QeACavWhgqlNQSxyMQfnIkxKv0iJXBx9+VYdMpPLXFufA9SCnCPcRRKXC3o9aP1YYKPpEBjMbNQcpYRut0dFxaJY6ABYQ/0NuYAv0n5sBZs6NzzgctEdfJ6vvh+3qo6EzZidIb/V9wIkXivYyJ7tlLRMo6jQYtvbNljGlF9zDUn/9cpfC0lUHdJmy+6j0i0kYWau8paUuWw63CwT3kcK7qR5jn3wQG3ec4BaSA7emvvvQSR3j1QZ8R019EnLySlcVv5dh0np8lRMF+BhdxrYwNJg+PAHUW1bdAxNn9QFNGLyIgZVIUaGlzHaaw3WOB8BM/ij/Qv1tZ/FmDzZa3ZAVBDMRBMdxVWX6OKzhvdD4/SStRzzyP1LDMhh4mX2oljqACXfiTlaIpGzk877KVasTcJKC6dTA2nu06oBididQI9v7JtEgnL6CcIUxPZBp/rc4xBMJR5EzEq5CpyPFXuYzNVr0fIUMC3dmBTeB+iPMgQHCOnxwFKhJnvUTU8yw9ZQEt7S69EkdQgfayFDne+6EGm614A0GMpgHVbTI2gdwtGtTFUNsdpTmzIpWfcuslIYrxPUFLh2xMIYfTPGhjAi18ZtW2r1rGJsurXikiRtO479bx02pRynAhdQJyDZo3JSoGGogZPW7ydJcoIFWC6zHQRBv+FY590EEH+g+WQB9ajM1WsdaOWE3Tmk5hCnko0NxBEIUgOp2ZE2f1S4uKjImJHJ3Wb9aCTCchAsMJEv/wL+wIx0PCeoncgRaOnWbYcRyowSbzf8mcZzE3HijGurE5ZLkNfbgg0iLaF7mkQa9MHyS5PmR4dWlOT9B0Fb2L404IT5H8gX7jbYZjwqVl2GT+VQQhIz4UWobasEncQ4BmhgtpEQSERELEM39HJ9j7sDQVypfiAh1E2c57nGXHsQmbrHhNAWJFqHXoLnHYJJo13Ul2ZBzBNTHY0QWyLZzmQV8giWU4NH/V7kQtNlde1UrCHuhXNJ5BNo0jnaMBgRNZGPTwLzk9/Pqgz7Jw/1GWbrVq2sK5QPN/IuT/VqdebV6gNWeRJnciAjJIr+5s9yYpEkZC2JrIvUIzlKH/MftUxf9JAaJj7ra73o1No/1ccppEkDFcGcEO/8KOmyF85TgRF0E4rV3jML0V+rLXETN6Navr5dhM8rVA95xkUJ6zgMFtDqwqjEsc9SZx3ljx2pv/VKXIs8OpK9ALqM8gm8o9TPMJIVFAQUuZARaGHTQ1z7bY6DYsUiEUzeK8U1h4zKrp8GJsqqqNTqQHZYZ/727YXPK1qUCXYcCuwzUDGId/0VwdxyYk33obwHnru/SnZu/jyFu6X18EKDf17pOxybI7goYpc0QUFDGlH3AM/+IluztC6BnDG+gj2jUOcztHi/I3SALSQ8oCNYNt2GRybCpoSMu0C4ibIL00BVhExMrYGA+E4PuyaS7EpXRbc99V8a0uQfqQKZSJsqaTx4KW+GeDSLRrwjRg0sOGDTI8BF8T6kkQD8F7WnPH4S/DJvIt3eNE+uT2pCzQprOxFMMmP0EQF5IyDxi1d2BDhGagLYMI4uAl2sfe5hahl+y2I33E6UlqO+hs3ATcI0HblJmSwLPdyMwARh3d2BihGWiY7+QK9B/N3Gjnf7cA6UResIAC+rhFbHPoQlnqHd2AQfykRQTpJH44Lx4YdR2ODRKigV5g5wr0Uc2PhCdlbJ68dSuQXmSiSqC7UBZox5B2utxDSXTCWGAx5WV9BTwi3f8mMHvIgQ0SooF+hi/QxzV3HLXYREtWOfUHepJF9+U6+boI0CU6FquSGWcfJmXcLzkFxERwShOmxgO722VskBAN9FS+LcdWzUa7xdg8nrUc5QCxDyhqK2NV+kutd1PeXEloC4wyXnieIAbk+RfGAIX2JB1+IRro5FzEjv2G7D4zi9DF6wsEpJtzKihKp0TwRtCra5yM1dhuAmYZr3YiThGpXwkXRCfplJMBuqRebcNGCdFAx78iIv2Eb60UJo/t/75shYj0m52me96o3BF0u4ny82G7FZhZoqY+OchuJwp3VAQBEZdr0JNjoiygT183NkyIBjrmfoL0+0Mj0HtryrBZ8jx7JMShU09QMoyyZsW1Ad0iLqO8adEXdEmamrNw9r12IqIGRJJy7+yFOWOSQLcu7bFxQjTQlnki0u/YZxp9SbUyNkv+Lq7zNHGUYgKiKZ+SbO2AwwjaT0hb0MnSfeqASU++PPPpXnOmT5/T6+mZLz85acDU7jHAY5gNGydUAz2AIP2OnqZfjj1g2gJdVEWpQFMIUg4oediBVWWPBAqey4m2jsDBkhQfmThtdMC0xMj4JAtwijb0Vk6IBhrefEJAbNivfG+pxGbJX7Zc5Ar0ogGg5EbKu97dgEcE5fo4ZYoSj2bdQYdqoLuP1x9o70Gtu1fYJDuLVnJ2n9jTdFbZsO1O4NKD9jXvg2bTwdg8h2qgk+aLSK9CjXMVfw02R1H+Kt7unUGgIHUwZQd9M3Aa7FD/ou2h2aTbsJFCNdCQQ/mMxdcNfdi0IrRngxPxkSbqbUuydQZOYx1YlftRaCbXxGFDhWygsxbpD/TW5jklXPKuhDhJM0DBIzJWEdS36wHKLjo2AprH3TI2VMgGerSIKDja++vKZGyKwNQCAXHKTdb3DDJ23wTcOlO+bsJYaB4dW0qgOTpIC6ll6F9rsCl8y95CvMSZSUoLNOVUL7stUPD3aLJPXm4NNKdnJKSPF71NK0KfxKb4vnI/4Q/0HTFKNTsZq3EMAxr+x1rkB4BZ65aDy0ARaWN/AOvUJmyGvKWrJMQtJQsUdHNgRcE/MdJNNdG2K6F5jHRgY8lDoiEkxWcifQp/b4YJjfm7JAHxEsYPBAV3JtgUyQnpt0JQUofYVMSNheYRfZXDZqi4HhCaYl4VdQb6aNO/e1XxuYT4ifMtoKTDiKGPXHmRq+7uEBF0fMaOSL/yYkNHdIDmEt253ZXGGToidGfuZqUISI/Sg7TGUVMWaM/XLsRPcD0FrVqO5Nk6A32E0saxDhuvKH99AQqG1B1atSD9JX2B3trEA+2Kty8Xg8rzfGjVkigeFnKVod/7oQwbzl/9FkHBkOZCq5YkRte4GcGrXobeZ0LNzrfudaeAgjEnClq1KPMkxE4g71jVfFeOjZbn+ZSg4LyYBK1alDRdK7T9nSZ8VcWX/4sdBUWwt+44WprICYid95hqoH8zfKBdUf5uCQVpdjK0amFm6UiN9w21QO89gQ1WVLHWiYIj2BdAq5Zm4BM6An1QLdCnDK/ZeT6wo2DZ06BVi/OsnT3Qx1WfvTI40EWUGyrMpPuhVcszTkIUbIPt9m7CxvKsKUBBIxnQqgW6nwQd6APlhudZREHLTIRW/7J3Z6+NVXEAx3/kHwiIb3nKQx9KSkkoIQxtaOlzX1osDekyCem+ZGY6nW7aDs7zT87vHLncS2xdxoVq3fcVF6i4MIooqLiiiIq4Ia4o6F2apMltc29yoj3OfPDJmfamM985c+beX08uQznvQb9xyAL9xI7c+xvP3oUNY9qVuaTL0/hMo0H/Ivee3S3PPIQSjFy5Z3eZOm0wdOXxpMZLP8rdb7z5KGHDmNEKV1yegt0cvdj+zT3ol3elDiQ98yhKwOnKDvqyddpAVx6PHv1QZtC3vPgwyqBPQy2BYGRgYCASDoBHAXdQm+vPDAVM9V0b/Cpdz7eQ9es0HgyBKkJrhB6wL35wv2e3I7VnQglYNAZHC6Zae/ITp6JD65lrIuBFbLPVzWYv1DKesX9mAsp02J+uow08CE0fuPhcZ387+BM4s2m9hg6fXSbPzPaYR/rmeyYHlXlQNeUt6M+edB3jeEXiQNKLj3IpPYtWOFoqeo6jjbqi8yGo7fQechfaHNRyTZf1kbReFm9khLhp+CrwoIWIlyGta2ExB34MXM1N5vHvPqQXRzSOjvhI33lQwsAQuvE0ynHpgR156/P9HxNK0RWDo4TPFjgr5Y/GRCoMtQwWGFZjYtpD0NZH8hPlQXejJeot6K2KqzIUxsyFNh+/x3k0+Qr6qk1DMFb+tRpjatw76iwwrOn265t8Zv8tnz+moxTaPBxpTFT0Qdp6u0pBOy96td3HCu076MTVOlbShwdBBRvCQ9AfuS3Q38nbb9z/AcpB+QAcJWOwqjr2MqoF/Q8abvG82voOulNDF0w7CQpwn+jwcIjBe7vHb7+BIuXtqHdOROjQkgoGjRRfalbQHQLdGWcDcPy1Uu2g3Ybtfn1C2n7jA0I5aDR89G8VoWlbn1idXCYNTXon1DK/pwsTOV2TsOxl/r2gGRcmnTO0MT6cbk7QKQ33MeREyMo3dMdfcphhldqnclx6ZUfWfuMxlITtXfA0jiV6IgCQnDxHiLwnCLXEevosGxwtG32W0ey/uEJf12da6S4QOmgm3Iygx6NYZBjdG91a6ZIoVLh/N6dVF137VI4/X7nxuO03sNYtu8AEt/K66DTce21cGFnw7Iy99dCnoAb5QYt5sAT7ZxeIoUWcbEbQ1wq0MIqvdybD0BabWj21f0l9WYVNx7LwH/Slr+Qs0LfJ228gzwfhSJEtK2jaAEeofz0B3nXYQVPnfxD0HDgCvcvaNloKWflB5wpOz/p1F8JgC/WuOJdkhhKbDh2Pdnv1KMcnu1IW6DvN/YYsWgqOFuTcriMJJaoFDdC2ItBCJ6QHHegjtOgHXl6oT2NoiaowKZMRDI/Aqs9Nev7DHUn7DR0lYWIxADVsEJpoKKZy0DCe58UjgyUHnV5gzt92B19d6AShiXWl4Pgbj3KsUOPcpHd3pew3zOfdspA+ALVs6mihtYTKQUMibmdHHZKDDgw63Y70w0HJqFP6pgqjSv0FPMI2f7p6sl/KPNJjHKXRPDR6XkcbN3qyQXWDDg6hhVYDcoMOrZKzmQlAhZPC/lKGgqCAaXFU0KJqx7H7uIR5/mce1lEafRZqC/cQQwvT9dH5mKpBw5xhf961kNyg2+zNDCskql+IhpaL7aCAYA8e7vZCZdB/SZize9Cc55eGn2oHD5KCsEicyrQpGnTWQAu/Sm7QEY4mvhWGKss6mngWVJBeQDfub7Dy/JePS/j+wYc5ylPIgSf9cc7QwbCwllUz6HGOlq2k3KCT9tX0Fag26zxZTYASpsThQX8h/302b3rpIUJ5xCB4dCGqMdzHqGtOyaDDaBdN2aYELRZdH8CpdfL2SXFo0D9VLNB/NrpA3/HgSw+hRDQWBq8iiwaWMONkQMGgg1vO3iDdnKBPQLWMs0JPgRqCo8S8Ddtd+mOn8fWZozw0HAMfUqNxKhWtpRQMukWgZSsmN+iYfTXaOHyUnHKgiGScvA3bffpKo+fXPXeXzJ65lgZfIudXuYYOHh9QL+gp+5Xw7ja5QYcn0CJiLoMwhCaeBFUsCXR1e8Ww3R+7x+D8uoohaL9iq1px0zGrXtCLwhmXlX0feoYfNrJxjTMUPqHCs29Hh8Y8zCZ92+D7bN77luAoD9PqGztPDBPaJiJNCzo3wtA0WnaJWNwJesBX0G4jv5SRHHRgk6MlP16Z+qKzQPeEQR2thW23Ffpg0N/tNnhe7kWU2vNioN6ZLO485s02LeisMxpR/g1TqXP2/xsarzvoTUJLvF/2LEdKoEVMH/IDNK3CAGlRn1Zz2O69F25s7DxzgTLRDNRren/eJtG0oNv3l9JB2Nc2xtGyHqw36CkdbUMDsoOODbvv49LFP/1LoBLz2bBL0NLeZ/PW+97WUCJG+Rj4EV4qZdTPmx40rBCauMiC44xAC52EOoMeFKW3f5YdNMwaTgD66RAUpeJOF6IP1BJbI6y0/b60p4Q3vUMoE/kdbZ7cm1kCx9R+0Lm6g/Z+pMfCFJhCmXNOjef6fQVdbDe5KNCmXwfygx4njjYxegFsvWNxdIg0KCZ5irAC+6F8x/FqA+P83/+soVTxXvDlQmGbjMmYdapdME9oYgvJ5gXdxgltoq+zPzd/neYEThsBX0G3tiSTyZb0mRNC';

function AMALCompiler( aoz )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	if ( !this.aoz.amalAlreadyDone )
		this.aoz.amalAlreadyDone = [];
}
AMALCompiler.prototype.compile = function( source, options )
{
	// Already done?
	for ( var a = 0; a < this.aoz.amalAlreadyDone.length; a++ )
	{
		if ( source == this.aoz.amalAlreadyDone[ a ].source )
			return this.aoz.amalAlreadyDone[ a ].code;
	}

	// Compile
	this.errors = [];
	if ( !options )
		options = {};
	if ( !options.tabs )
		options.tabs = '\t';
	var info = this.compileLoop( source, false, options );
	if ( this.utilities.isArray( info ) )
		return info;

	// Build the code
	var code = 'function %$NAME(aoz,amal)\n'
	code += '{\n';
	code += '	this.aoz=aoz;\n';
	code += ' 	this.amal=amal;\n';

	// Insertion of the blocks of code
	code += '\tthis.blocks=[];\n';
	for ( var b = 0; b < info.blocks.length; b++ )
	{
		code += '\tthis.blocks[' + b + ']=function()\n\t{\n';
		code += info.blocks[ b ];
		code += '\t};\n';
	}

	// Insertion of the autotest
	code += '\tthis.blocksAutotest=[];\n';
	if ( info.autotest )
	{
		for ( var b = 0; b < info.childInfo.blocks.length; b++ )
		{
			code += '\tthis.blocksAutotest[' + b + ']=function()\n\t{\n';
			code += info.childInfo.blocks[ b ];
			code += '\t};\n';
		}
	}
	code += '}\n';

	// Accelerates next time!
	this.aoz.amalAlreadyDone.push(
	{
		source: source,
		code: code
	} );
	return code;
}
AMALCompiler.prototype.compileLoop = function( source, parent, options )
{
	options.tabs += '\t';
	var info = new Information( this.aoz, source, this, options );
	if ( parent )
	{
		info.parent = parent;
		parent.childInfo = info;
	}
	this.toCompile = [];

	var quit = false;
	while( !quit )
	{
		//try
		{
			info.extractNextWord( '#instruction #label' );
			if ( info.eol )
				break;

			switch ( info.type )
			{
				case 'label':
					var label = info.labels[ info.text ];
					if ( !label )
					{
						label =
						{
							name: info.text,
							info: info,
							toReplace: []
						};
					}
					info.nextBlock( '' );
					label.block = info.blockNumber;
					info.labels[ info.text ] = label;
					break;
				case 'token':
					var token = info.token;
					info.waitingFunctionCount = 0;

					// A normal token
					if ( typeof token.compile == 'undefined' )
						info.throwError( 'instruction_not_implemented' );

					// Must be a normal instruction
					var isInstruction = false;
					var isJump = false;
					var isParams = false;
					var maxLength = 1;
					var t;
					if ( typeof token.params == 'string' )
					{
						isInstruction = true;
					}
					else
					{
						for ( t = 0; t < token.params.length; t++ )
						{
							var c = token.params[ t ].charAt( 0 );
							if ( c == 'I' || c == 'V' )
							{
								isInstruction = true;
								isParams = true;
								maxLength = Math.max( maxLength, token.params[ t ].length );
								break;
							}
							if ( c == 'J' )
							{
								isJump = true;
								break;
							}
						}
					}
					if ( isParams && maxLength == 1 )
						isParams = false;
					if ( !isInstruction && !isJump )
						info.throwError( 'instruction_not_implemented' );

					// In autotest?
					if ( info.parent && !token.autotest )
						info.throwError( 'syntax_error' );

					// Special case?
					var func = token.compile[ t ];
					if ( func && func.indexOf( '#' ) == 0 )
					{
						specialCases[ func.substring( 1 ) ].call( this, info );
						break;
					}

					// Extract the parameters
					var found = !isParams;
					var params = 0, numberOfParams = 0;
					var isVariable = ( token.params[ 0 ].charAt( 0 ) == 'V' );
					var isReservedVariable = 0;
					var foundSyntax = isVariable ? 'V' : 'I';
					var parameters = [];
					var positions = [];
					if ( isParams || isJump )
					{
						info.peekNextWord();
						if ( info.text == '(' )
						{
							if ( isVariable )
								info.setPeekNextWordEnd();
						}
						else if ( isVariable )
						{
							info.endOfInstruction = true;
						}
						info.peekNextWord( '#function' );
						if ( info.type != 'token' && info.type != 'number' )
							info.endOfInstruction = true;

						if ( !info.endOfInstruction )
						{
							while( true )
							{
								positions[ foundSyntax.length ] = info.position;
								info.compileExpression( isVariable );
								parameters[ params ] = info.result;
								switch( info.returnType )
								{
									case '0':
									case '1':
										foundSyntax += '0';
										break;
									case '2':
										foundSyntax += '2';
										break;
									case '?':
										foundSyntax += '?';
										break;
								}

								info.peekNextWord();
								if ( info.endOfInstruction )
								{
									numberOfParams = params + 1;
									break;
								}
								if ( info.text == ')' )
								{
									numberOfParams = params + 1;
									if ( !isVariable )
										info.throwError( 'syntax_error' );
									info.position = info.peekNextWordEnd;
									break;
								}
								if ( info.text.toLowerCase() == 'to' )
									foundSyntax += 't';
								else if ( info.text.toLowerCase() == ',' )
									foundSyntax += ',';
								else
								{
									numberOfParams = params + 1;
									break;
								}

								info.setPeekNextWordEnd();
								params++;
							}
						}
						var paramNumber = 0;
						for ( var s = 0; s < token.params.length; s++ )
						{
							var syntax = token.params[ s ];
							if ( foundSyntax.length == syntax.length )
							{
								if ( foundSyntax == syntax )
								{
									found = true;
									break;
								}
								for ( var p = 1; p < foundSyntax.length; p++ )
								{
									if ( foundSyntax.charAt( p ) == '?' )
									{
										foundSyntax = syntax.substring( 0, p ) + syntax.charAt( p ) + syntax.substring( p + 1 );
									}
									else if ( syntax.charAt( p ) >= 'A' && syntax.charAt( p ) <= 'C' )
									{
										foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
										isReservedVariable = p;
									}
								}
								var paramNumber = 0;
								for ( var p = 1; p < syntax.length; p++ )
								{
									var foundChar = foundSyntax.charAt( p );
									var char = syntax.charAt( p );
									if ( foundChar != char )
									{
										if ( char == '3' )
										{
											parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*this.aoz.degreeRadian';
										}
										else if ( char != '?' )
										{
											if ( this.utilities.getCharacterType( char ) == 'number')
												info.throwError( 'type_mismatch' );
											else
												info.throwError( 'syntax_error' );
										}
									}
									if ( char == ',' || char == 't' )
										paramNumber++;
								}
								if ( p >= syntax.length )
								{
									found = true;
									break;
								}
							}
						}
					}
					if ( !found )
						info.throwError( 'syntax_error' );

					// Generates the code
					var code = isParams ? token.compile[ s ] : token.compile;
					if ( code != '' )
					{
						if ( isVariable )
						{
							info.extractNextWord();
							if ( info.text != '=' )
								info.throwError( 'syntax_error' );
							var type = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
							info.compileExpression();
							if ( !this.checkTypes( type, info.returnType ) )
								info.throwError( 'type_mismatch' );
							if ( ! isReservedVariable )
							{
								code = this.utilities.replaceStringInText( code, '%$PV', 'set' );
								code = this.utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? info.result : info.result + ',' );
								code = this.utilities.replaceStringInText( code, '%$P;', ';' );
							}
							else
							{
								var save = info.position;
								var saveResult = info.result;
								info.position = positions[ isReservedVariable ];
								info.extractNextWord( '#register' );
								info.extractVariableAssignment( 'input' );
								info.position = save;
								code = this.utilities.replaceStringInText( code, '%$PV', 'set' );
								code = this.utilities.replaceStringInText( code, '%$P0', info.result );
								code = this.utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? saveResult : saveResult + ',' );
								code = this.utilities.replaceStringInText( code, '%$P;', ';' );
							}
						}
						for ( var p = numberOfParams - 1; p >= 0; p-- )
						{
							code = this.utilities.replaceStringInText( code, '%$P' + p, parameters[ p ] );
						}
						info.addLine( code );
						if ( token.newBlock )
							info.nextBlock( '' );
					}
					break;
				default:
				case 'semicolumn':
					break;
			}
			if ( this.errors.length )
				break;	
		}
		/*catch( error )
		{
			info.errors.push( 'internal_error' );
		}*/
	}
	info.nextBlock( 'return{type:0};' );

	if ( this.errors.length )
		return this.errors;

	if ( info.pile.length > 1 )
	{
		for ( var l = 1; l < info.pile.length; l++ )
		{
			var loop = info.pile[ l ];
			this.errors.push( { error: 'for_without_next', position: loop.position } );
		}
	}

	// Compile sub-sections
	for ( var c = 0; c < this.toCompile.length; c++ )
	{
		var childInfo = this.compileLoop( this.toCompile[ c ], info, options );
		/*if ( this.utilities.isArray( childInfo ) )
			childInfo.throwError( 'syntax_error' );*/
	}
	if ( this.errors.length )
		return this.errors;

	// Relocate labels
	for ( var l in info.labels )
	{
		var label = info.labels[ l ];
		if ( typeof label.block == 'undefined' )
			info.throwError( 'label_not_defined' );
		for ( var t = 0; t < label.toReplace.length; t++ )
		{
			var toReplace = label.toReplace[ t ];
			toReplace.info.blocks[ toReplace.block ] = this.utilities.replaceStringInText( toReplace.info.blocks[ toReplace.block ], toReplace.text, '' + label.block );
		}
	}

	// Done!
	options.tabs = options.tabs.substring( 0, options.tabs.length - 1 );
	if ( this.errors.length )
		return this.errors;
	return info;
};
var specialCases = {};
specialCases.handleExit = function( info )
{
	var code = 'return{type:0};';
	info.addLine( code );
}
specialCases.handleDirect = function( info )
{
	info.extractNextWord( '#jump' );
	if ( info.type != 'jump' )
		info.throwError( 'syntax_error' );
	var label = info.parent.labels[ info.text ];	// Labels in main program!
	if ( !label )
		info.throwError( 'label_not_defined' );
	var toReplace =
	{
		info: info,
		block: info.blockNumber,
		text: toReplace = '%$PL' + info.labelCount++ + '$%'
	}
	label.toReplace.push( toReplace );
	var code = 'this.amal.direct(' + toReplace.text + ');return{type:0};';
	info.addLine( code );
}
specialCases.handleAutotest = function( info )
{
	if ( this.autotest )
		info.throwError( 'syntax_error' );
	this.autotest = true;
	info.extractNextWord();
	if ( info.text != '(' )
		info.throwError( 'syntax_error' );

	// Extract autotest
	var start = info.position;
	var bracketCount = 1;
	var end;
	while( true )
	{
		end = info.position;
		info.extractNextWord();
		if ( info.text == '(' )
			bracketCount++;
		if ( info.text == ')' )
		{
			bracketCount--;
			if ( bracketCount == 0 )
				break;
		}
	}
	var source = info.line.substring( start, end );
	this.toCompile.push( source );
	info.autotest = true;
};
specialCases.handleFor = function( info )
{
	info.extractNextWord( '#register' );
	if ( info.type != 'token' )
		info.throwError( 'syntax_error' );
	var token = info.token;
	var register = token.register;
	if ( !register )
		info.throwError( 'syntax_error' );
	var variable = token.compile[ 0 ];
	var toUpdate = token.toUpdate;
	var register = token.register;
	info.extractNextWord();
	if ( info.text != '=' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	var code = variable + '=' + info.result + ';';
	if ( toUpdate )
		info.addLine( 'this.amal.toUpdate=' + toUpdate + ';' );
	info.nextBlock( code );

	// To
	info.extractNextWord( '#instruction' );
	if( info.type != 'token' )
		info.throwError( 'syntax_error' );
	if ( info.token.abbreviation != 'T' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );

	var pokeLabel = '%$PNEXT' + info.labelCount++;
	code = 'if(' + variable + '==' + info.result + ') return{type:1,label:' + pokeLabel + '};';
	info.addLine( code );
	info.pile.push(
	{
		register: register,
		toUpdate: toUpdate,
		variable: variable,
		loopBlock: info.blockNumber,
		pokeLabel: pokeLabel,
	} );
};
specialCases.handleNext = function( info )
{
	if ( info.pile.length < 1 )
		info.throwError( 'next_without_for' );
	var loop = info.pile.pop();
	info.peekNextWord( '#register' );
	if ( info.type == 'token')
	{
		if ( !info.token.register )
			info.throwError( 'next_without_for' );
		if ( info.token.register != loop.register )
			info.throwError( 'next_without_for' );
		info.setPeekNextWordEnd();
	}
	var code = loop.variable + '++;';
	if ( loop.toUpdate )
		code += 'this.amal.toUpdate=' + loop.toUpdate + ';';
	code += 'return{type:4,label:' + loop.loopBlock + '};';
	info.nextBlock( code );
	info.blocks[ loop.loopBlock ] = this.utilities.replaceStringInText( info.blocks[ loop.loopBlock ], loop.pokeLabel, '' + info.blockNumber );
};
specialCases.handleIf = function( info )
{
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	var code = 'if(' + info.result + ')';
	info.addLine( code );
	/*
	info.extractNextWord( '#instruction' );
	if ( info.type != 'token' || info.text != 'J' )
		info.throwError( 'syntax_error' );
	code += specialCases.handleJump.call( this, info, true );
	info.addLine( code );
	*/
};
specialCases.handleLet = function( info, fromFor )
{
	info.extractNextWord( '#register' );
	if ( info.type != 'token' )
		info.throwError( 'syntax_error' );
	var token = info.token;
	if ( !token.register )
		info.throwError( 'syntax_error' );

	var code = token.compile[ 0 ];
	info.extractNextWord();
	if ( info.text != '=' )
		info.throwError( 'syntax_error' );
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	code += '=' + info.result + ';';
	if ( typeof token.toUpdate != 'undefined' )
		code += 'this.amal.toUpdate|=' + token.toUpdate + ';';
	if ( !fromFor )
		info.addLine( code );
};
specialCases.handleJump = function( info, fromIf )
{
	info.extractNextWord( '#jump' );
	if ( info.type != 'jump' )
		info.throwError( 'syntax_error' );
	var label = info.labels[ info.text ];
	if ( !label )
	{
		label =
		{
			name: info.text,
			toReplace: []
		};
		info.labels[ info.text ] = label;
	}
	var toReplace =
	{
		info: info,
		block: info.blockNumber,
		text: '%$PL' + info.labelCount++ + '$%'
	};
	label.toReplace.push( toReplace );
	var code = 'return{type:1,label:' + toReplace.text + '};';
	if ( !fromIf )
	{
		code = 'return{type:1,label:' + toReplace.text + '};';
		info.addLine( code );
	}
	else
	{
		code = 'return{type:1,label:' + toReplace.text + '};';
	}
	return code;
};
specialCases.handlePlay = function( info )
{
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	var code = 'this.amal.play(' + info.result + ');';
	info.addLine( code );
};
specialCases.handleAnim = function( info )
{
	var code = 'this.amal.anim(';
	info.compileExpression();
	if ( !info.checkTypes( '0', info.returnType ) )
		info.throwError( 'type_mismatch' );
	code += info.result + ',[';
	info.extractNextWord();
	if ( info.text != ',' )
		info.throwError( 'syntax_error' );
	do
	{
		info.extractNextWord();
		if ( info.text != '(' )
			info.throwError( 'syntax_error' );
		info.compileExpression();
		if ( !info.checkTypes( '0', info.returnType ) )
			info.throwError( 'type_mismatch' );
		code += '{i:' + info.result + ',';
		info.extractNextWord();
		if ( info.text != ',' )
			info.throwError( 'syntax_error' );
		info.compileExpression( true );
		if ( !info.checkTypes( '0', info.returnType ) )
			info.throwError( 'type_mismatch' );
		code += 't:' + info.result + '}';
		info.extractNextWord();
		if ( info.text != ')' )
			info.throwError( 'syntax_error' );
		info.peekNextWord();
		if ( info.text != '(' )
			break;
		code += ',';
	} while( true )
	code += ']);';
	info.addLine( code );
};









function Information( aoz, source, amal, options )
{
	this.aoz = aoz;
	this.amal = amal;
	this.line = source;
	this.options = typeof options == 'undefined' ? {} : options;
	this.position = 0;
	this.text = '';
	this.textLower = '';
	this.tabs = typeof this.options.tabs != 'undefined' ? this.options.tabs : '';
	this.type = '';
	this.tokens = window.AMALTokens;
	this.blocks = [];
	this.pile = [];
	this.labels = {};
	this.labelCount = 0;
	this.blockNumber = 0;
	this.currentBlock = '';

	this.utilities = amal.utilities;
}
Information.prototype.compileExpression = function(endOnBracket, saveCounts )
{
	var saveBracket = this.endOnBracket;
	this.endOnBracket = endOnBracket;
	var save1 = this.numberOfOperands;
	var save2 = this.typeLastOperand;
	var saveComparaison = this.comparaison;
	this.compileExp();
	this.endOnBracket = saveBracket;
	this.comparaison = saveComparaison;
	this.acceptCommas = false;
	this.operator = false;
	if ( saveCounts )
	{
		this.numberOfOperands = save1;
		this.typeLastOperand = save2;
	}
};
Information.prototype.compileExp = function()
{
	var type;
	var quit = false;
	var code = '';
	var comparaison = this.comparaison;
	this.constant = true;
	this.numberOfOperands = 0;
	var power = false;
	var powerPosition1, powerPosition2;

	while( !quit )
	{
		// An operande first!
		var positionOperand = code.length;
		this.operator = false;
		skipOperator = false;
		this.extractNextWord( '#function' );
		this.typeLastOperand = this.type;

		switch ( this.type )
		{
			case 'token':
				var token = this.token;

				// Special case for NOT
				if ( this.token.token == '!' )
				{
					code += '!(';
					this.acceptCommas = true;
					this.compileExpression( false, true );
					code += this.result + ')';
					if ( this.returnType != '0' )
						this.throwError( 'type_mismatch' );
					if ( !type )
						type = this.returnType;
					break;
				}

				// Must be a function
				var foundSyntax = '';
				var isParams;
				if ( typeof token.params == 'string' )
				{
					foundSyntax = 'dummy';
					isParams = false;
				}
				else
				{
					for ( var t = 0; t < token.params.length; t++ )
					{
						if ( token.params[ t ].charAt( 0 ) == 'V' || this.utilities.getCharacterType( token.params[ t ].charAt( 0 ) ) == 'number' )
						{
							foundSyntax = token.params[ t ].charAt( 0 );
							isParams = true;
							break;
						}
					}
				}
				if ( foundSyntax == '' )
					this.throwError( 'syntax_error' );
				if ( typeof token.compile == 'undefined' )
					this.throwError( 'function_not_implemented' );

				var found = !isParams;
				var numberOfParams = 0;
				var parameters = [];
				var positions = [];
				var isVariable = ( foundSyntax == 'V' );
				if ( isParams )
				{
					// Special case?
					if ( token.compile[ t ].indexOf( '#' ) == 0 )
					{
						var func = token.compile[ t ].substring( 1 );
						specialCases[ func ].call( this );
						code += this.result;
						this.constant = false;
						type = this.returnType;
						break;
					}

					// Extract the parameters
					this.peekNextWord();
					if ( this.text == '(' )
					{
						this.setPeekNextWordEnd();

						var params = 0;
						while( true )
						{
							positions[ foundSyntax.length ] = this.position;
							this.acceptCommas = true;
							this.compileExpression( true, true );
							parameters[ params ] = this.result;
							switch( this.returnType )
							{
								case '0':
								case '1':
									foundSyntax += '0';
									break;
								case '2':
									foundSyntax += '2';
									break;
								case '?':
									foundSyntax += '?';
									break;
							}
							this.peekNextWord();
							if ( this.text == ',' )
							{
								foundSyntax += ','
								this.setPeekNextWordEnd();
							}
							else if ( this.textLower == 'to' )
							{
								foundSyntax += 't';
								this.setPeekNextWordEnd();
							}
							else if ( this.text == ')' )
							{
								numberOfParams = params + 1;
								this.setPeekNextWordEnd();
								break;
							}
							else
							{
								this.throwError( 'syntax_error' );
							}
							params++;
						}
					}

					for ( var s = 0; s < token.params.length; s++ )
					{
						var syntax = token.params[ s ];

						if ( syntax.charAt( 0 ) == foundSyntax.charAt( 0 ) )
						{
							if ( foundSyntax == syntax )
							{
								found = true;
								break;
							}

							if ( foundSyntax.length == syntax.length )
							{
								var paramNumber = 0;
								for ( var p = 1; p < syntax.length; )
								{
									if ( foundSyntax.charAt( p ) != syntax.charAt( p ) )
									{
										if ( foundSyntax.charAt( p ) == '?' )
										{
											foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
										}
										if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'letter' )
										{
											syntax = syntax.substring( 0, p ) + String.fromCharCode( syntax.charCodeAt( p ) - 65 + 48 ) + syntax.substring( p + 1 );
											if ( syntax.charAt( p ) != foundSyntax.charAt( p ) )
											{
												this.throwError( 'type_mismatch' );
											}
										}
										else if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'number' )
										{
											if ( syntax.charAt( p ) == '3' && foundSyntax.charAt( p ) == '0' )
											{
												parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*this.aoz.degreeRadian';
											}
											else
											{
												this.throwError( 'type_mismatch' );
											}
										}
										else
										{
											if ( syntax.charAt( p ) != '?' )
											{
												this.throwError( 'type_mismatch' );
											}
										}
									}
									if ( this.utilities.getCharacterType( syntax.charAt( p ) ) == 'number' || syntax.charAt( p ) == '?' )
										paramNumber++;
									if ( ++p >= syntax.length )
									{
										found = true;
										break;
									}
								}
								if ( found )
									break;
							}
						}
					}
				}
				if ( !found )
					this.throwError( 'syntax_error' );

				// Check types
				var addBracket = '';
				var subCode = isParams ? token.compile[ s ] : token.compile;
				var tokenType;
				if ( !isVariable )
				{
					if ( isParams )
						tokenType = token.params[ s ].charAt( 0 );
					else
						tokenType = token.params.charAt( 0 );
				}
				else
				{
					tokenType = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
					subCode = this.utilities.replaceStringInText( subCode, '%$PV', 'get' );
					subCode = this.utilities.replaceStringInText( subCode, '%$PP', '' );
					subCode = this.utilities.replaceStringInText( subCode, '%$P;', '' );
				}
				if ( !type )
					type = tokenType;
				var addBracket1 = '';
				var addBracket2 = '';
				if ( !this.checkTypes( tokenType, type ) )
				{
					if ( token.params[ s ].charAt( 0 ) == '3' )
					{
						addBracket1 = '(';
						addBracket2 = '*this.aoz.degreeRadian)';
					}
					else
					{
						this.throwError( 'type_mismatch' );
					}
				}

				// A waiting function?
				if ( token.waiting )
				{
					for ( var p = numberOfParams - 1; p >= 0; p-- )
						subCode = this.utilities.replaceStringInText( subCode, '%$P' + ( p + 1 ), parameters[ p ] );
					subCode = this.utilities.replaceStringInText( subCode, '%$PN', this.waitingFunctionCount );
					this.nextBlock( subCode );
					subCode = addBracket + 'this.aoz.results[' + this.waitingFunctionCount++ + ']';
				}
				else
				{
					// Normal function
					subCode = addBracket1 + subCode + addBracket2;
					for ( var p = numberOfParams - 1; p >= 0; p-- )
						subCode = this.utilities.replaceStringInText( subCode, '%$P' + p, parameters[ p ] );
				}
				code += subCode;
				this.constant = false;
				break;

			case 'number':
				if ( !type )
					type = this.returnType;
				if ( !this.checkTypes( type, this.returnType ) )
					this.throwError( 'type_mismatch' );
				code += this.text;
				break;

			case 'string':
				if ( !type )
					type = this.returnType;
				if ( !this.checkTypes( type, this.returnType ) )
					this.throwError( 'type_mismatch' );
				code += '"' + this.text + '"';
				break;

			default:
				if ( this.text == '-' || this.text == '–' )
				{
					code += '-';
					skipOperator = true;
					break;
				}
				if ( this.text == '(' )
				{
					code += '(';
					this.compileExpression( true, true );
					code += this.result + ')';
					if ( !type )
						type = this.returnType;
					if ( !this.checkTypes( type, this.returnType ) )
						this.throwError( 'type_mismatch' );
					this.peekNextWord();
					if ( this.text != ')' )
						this.throwError( 'syntax_error' );
					this.setPeekNextWordEnd();
					this.constant = false;
					break;
				}
				if ( this.text == '$' )
				{
					var text = '';
					var savePosition = this.position;
					for ( ; this.position < this.line.length; this.position++ )
					{
						c = this.line.charAt( this.position ).toUpperCase();
						var ascii = c.charCodeAt( 0 );
						if ( !( ( ascii >= 48 && ascii <= 57 ) || ( ascii >= 65 && ascii <= 70 ) ) )
							break;
						text += c;
					}
					if ( text.length > 0 )
					{
						if ( !type )
							type = '0';
						if ( !this.checkTypes( type, '0' ) )
							this.throwError( 'type_mismatch' );
						code += '0x' + text;
						break;
					}
					this.position = savePosition;
				}
				if ( this.text == '%' )
				{
					var text = '';
					var savePosition = this.position;
					for ( ; this.position < this.line.length; this.position++ )
					{
						c = this.line.charAt( this.position );
						if ( c != '0' && c != '1' )
							break;
						text += c;
					}
					if ( text.length > 0 )
					{
						if ( !type )
							type = '0';
						if ( !this.checkTypes( type, '0' ) )
							this.throwError( 'type_mismatch' );
						code += '0b' + text;
						break;
					}
					this.position = savePosition;
				}
				if ( this.text == ',' || this.text == ';' || this.remark )
				{
					code += 'undefined';
					if ( type )
						this.throwError( 'syntax_error' );
					type = '?';
					this.position = this.column;
					skipOperator = true;
					quit = true;
				}
				else if ( this.eol )
				{
					code += 'undefined';
					if ( type )
						this.throwError( 'syntax_error' );
					type = '?';
					skipOperator = true;
					quit = true;
				}
				else
				{
					this.throwError( 'syntax_error' );
				}
				break;
		}
		this.numberOfOperands++;

		// ^ operator?
		if ( power )
		{
			var first = code.substring( powerPosition1, powerPosition2 );
			var second = code.substring( positionOperand );
			code = code.substring( 0, powerPosition1 ) + 'Math.pow(' + first + ',' + second + ')';
			power = false;
		}

		// An operator?
		if ( skipOperator )
			continue;

		this.operator = true;
		this.peekNextWord( '#operator' );
		if ( this.eol )
		{
			this.endOfInstruction = true;
			break;
		}
		else if ( this.text == 'J' || this.text == 'T' )
		{
			quit = true;
			break;
		}
		/*
		{
			else
			{
				this.throwError( 'syntax_error' );
			}
		}
		*/
		else
		{
			switch ( this.textLower )
			{
				case '&':
					if ( comparaison )
						code += '&&';
					else
						code += '&';
					this.setPeekNextWordEnd();
					if ( comparaison )
						type = undefined;
					break;
				case '|':
					if ( comparaison )
						code += '&&';
					else
						code += '&';
					this.setPeekNextWordEnd();
					if ( comparaison )
						type = undefined;
					break;
				case '^':
					powerPosition1 = positionOperand;
					powerPosition2 = code.length;
					power = true;
					this.constant = false;
					this.setPeekNextWordEnd();
					break;

				case '%':
				case '+':
				case '-':
				case '–':
				case '*':
				case '/':
				case '&':
				case '&&':
				case '|':
				case '||':
				case '<<':
				case '>>':
					code += this.text;
					this.constant = false;
					this.setPeekNextWordEnd();
					break;

				case '=':
					code += '==';
					this.setPeekNextWordEnd();
					comparaison = true;
					break;

				case '<':
				case '<=':
				case '>':
				case '>=':
				case '!=':
					code += this.text;
					this.constant = false;
					this.setPeekNextWordEnd();
					comparaison = true;
					break;

				case '<>':
					code += '!=';
					this.setPeekNextWordEnd();
					this.constant = false;
					comparaison = true;
					break;

				case ')':
					if ( !this.endOnBracket )
						this.throwError( 'syntax_error' );
					quit = true;
					break;

				case ',':
					quit = true;
					break;

				case ';':
					this.endOfInstruction = true;
				case ':':
				case ']':
					if ( this.endOnBracket )
						this.throwError( 'syntax_error' );
					quit = true;
					break;

				default:
					this.endOfInstruction = true;
					quit = true;
					break;
					//this.throwError( 'syntax_error' );
			}
		}
	}
	this.returnType = type;
	this.result = code;
};

Information.prototype.peekNextWord = function( tags )
{
	var position = this.position;
	this.extractNextWord( tags );
	this.peekNextWordEnd = this.position;
	this.position = position;
};
Information.prototype.extractNextWord = function( tags )
{
	tags = typeof tags == 'undefined' ? '' : tags;
	tags = tags.toLowerCase();
	var wantInstruction = tags.indexOf( '#instruction' ) >= 0;
	var wantFunction = tags.indexOf( '#function' ) >= 0;
	var wantRegister = tags.indexOf( '#register' ) >= 0;
	var wantOperator = tags.indexOf( '#operator' ) >= 0;
	var wantLabel = tags.indexOf( '#label' ) >= 0;
	var wantJump = tags.indexOf( '#jump' ) >= 0;
	var wantToken = wantInstruction || wantFunction || wantRegister || wantLabel | wantJump;

	this.token = false;
	this.text = '';
	this.textLower = '';
	this.type = '';
	this.endOfInstruction = false;
	var start = this.position;
	for ( ; this.position < this.line.length; this.position++ )
	{
		var t = this.line.charCodeAt( this.position );
		if ( !( t == 32 || ( t >= 97 && t < 97 + 26 ) ) )
			break;
	}
	if ( start == this.position && this.position >= this.line.length )
	{
		this.eol = true;
		this.endOfInstruction = true;
		return;
	}
	start = this.position;
	this.operator = false;
	this.debugLine = this.line.substring( this.position );
	var c = this.line.charAt( this.position );
	var type = this.utilities.getCharacterType( c );
	if ( type == 'quote' )
	{
		this.type = 'string';
		this.extractString();
		this.textLower = this.text.toLowerCase();
		return this.type;
	}
	else if ( type == 'number' || ( !wantOperator && type == 'minus' ) )
	{
		this.type = 'number';
		this.extractNumber();
		this.textLower = this.text.toLowerCase();
		return this.type;
	}
	else if ( type == 'letter' )
	{
		if ( wantToken )
		{
			do
			{
				// Try with first character
				var cc = this.line.charCodeAt( this.position++ );
				while ( ( cc >= 97 && cc < 97 + 26 ) && this.position < this.line.length )
					cc = this.line.charCodeAt( this.position++ );
				this.text = String.fromCharCode( cc );
				this.textLower = this.text.toLowerCase();

				if ( wantJump )
				{
					this.type = 'jump';
					return this.type;
				}
				if ( wantLabel )
				{
					// Scan for a ':'
					var explore = this.position;
					while ( explore < this.line.length )
					{
						var cc = this.line.charCodeAt( explore++ );
						if ( cc >= 97 && cc < 97 + 26 )
							continue;
						if ( cc != 58 )		// :
							break;

						// Found!
						this.position = explore;
						this.type = 'label';
						return this.type;
					}
				}

				// Try with second character
				if ( this.position < this.line.length )
				{
					var text = this.text;
					var explore = this.position;
					cc = this.line.charCodeAt( explore++ );
					while ( ( cc >= 97 && cc < 97 + 26 ) && explore < this.line.length )
						cc = this.line.charCodeAt( explore++ );
					text += String.fromCharCode( cc );

					// A token?
					if ( wantToken )
					{
						if ( this.tokens[ text ] )
						{
							this.position = explore;
							this.text = text;
							break;
						}
						if ( this.tokens[ this.text ] )
							break;
					}
				}

				// Not found
				this.type = 'other';
				return this.type;
			} while( true )

			// A token, conform?
			var ok = true;
			this.token = this.tokens[ this.text ];
			if ( wantFunction )
			{
				if ( !this.token.register )
				{
					if ( typeof this.token.params != 'string' )
					{
						for ( var p = 0; p < this.token.params.length; p++ )
						{
							if ( this.token.params[ p ].charAt(0) == 'I' )
							{
								ok = false;
								break;
							}
						}
					}
				}
			}
			else if ( wantRegister )
			{
				if ( !this.token.register )
				{
					ok = false;
				}
			}
			if ( ok )
			{
				this.type = 'token';
				return this.type;
			}
			this.type = 'other';
			return this.type;
		}

		// Anything...
		var cc = this.line.charCodeAt( this.position++ );
		while ( ( cc >= 97 && cc < 97 + 26 ) && this.position < this.line.length )
			cc = this.line.charCodeAt( this.position++ );
		this.text = String.fromCharCode( cc );
		this.textLower = this.text.toLowerCase();
		this.type = 'other';
		return this.type;
	}

	// Any other type
	this.text = c;
	this.type = type;
	this.position++;
	if ( c != ')' && c != ']' && c != '(' && c != ',' )
	{
		for ( ; this.position < this.line.length; this.position++ )
		{
			c = this.line.charAt( this.position );
			if ( this.utilities.getCharacterType( c ) != type || c == '$' )		// TODO!
				break;
			this.text += c;
		}
	}
	if ( this.text == ';' )
		this.endOfInstruction = true;
	this.textLower = this.text.toLowerCase();
	return this.type;
};
Information.prototype.extractNextChar = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = this.line.charAt( this.position++ );
	this.type = this.utilities.getCharacterType( this.text );
};
Information.prototype.extractString = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = '';
	var quote = this.line.charAt( this.position++ );
	if ( this.utilities.getCharacterType( quote ) == 'quote' )
	{
		while( this.position < this.line.length )
		{
			var c = this.line.charAt( this.position++ );
			if ( c == '\\' )
			{
				this.text += '\\\\';
				continue;
			}
			else if ( c == quote )
			{
				this.type = 'string';
				this.returnType = '2';
				return;
			}
			this.text += c;
		}
		this.throwError( 'string_not_closed' );
	}
	else
	{
		this.type = 'empty';
	}
};
Information.prototype.extractNumber = function()
{
	this.skipSpaces();
	if ( this.eol )
		return;

	this.text = '';
	this.type = 'empty';
	var c = this.line.charAt( this.position );
	if ( c == '-' || c == '–' )
	{
		this.position++;
		this.skipSpaces();
		if ( this.eol )
			return;
		this.text += '-';
		c = this.line.charAt( this.position );
	}
	if ( this.utilities.getCharacterType( c ) == 'number' )
	{
		this.text += c;
		this.position++;
		this.returnType = '0'
		while( this.position < this.line.length )
		{
			c = this.line.charAt( this.position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			this.text += c;
			if ( c == '.' )
				this.returnType = '1';
			this.position++;
		}
		this.type = 'number';
	}
};
Information.prototype.skipSpaces = function()
{
	this.eol = false;
	while( this.position < this.line.length && ( this.line.charCodeAt( this.position ) == 32 || this.line.charCodeAt( this.position ) == 9 ) )
		this.position++;
	if ( this.position >= this.line.length )
		this.eol = true;
};
Information.prototype.setPeekNextWordEnd = function()
{
	this.position = this.peekNextWordEnd;
};
Information.prototype.addLine = function( code )
{
	if ( code != '' && this.blocks )
		this.currentBlock += this.tabs + code + '\n';
};
Information.prototype.nextBlock = function( code )
{
	if ( code != '' )
		this.currentBlock += this.tabs + code + '\n';
	this.blocks[ this.blockNumber ] = this.currentBlock;
	this.blockNumber++;
	this.currentBlock = '';
};
Information.prototype.indent = function()
{
	this.tabs += '\t';
};
Information.prototype.unIndent = function()
{
	this.tabs = this.tabs.substring( 0, this.tabs.length - 1 );
};
Information.prototype.throwError = function( error )
{
	var error = this.aoz.errors.getError( error );
	var inAmal = this.aoz.errors.getError( 'in_amal_string', [ this.position ] );
	this.amal.errors.push( error.message + ' ' + inAmal.message );
};
Information.prototype.checkTypes = function( typeDestination, typeSource )
{
	typeDestination = typeof typeDestination == 'number' ? '' + typeDestination : typeDestination;
	typeSource = typeof typeSource == 'number' ? '' + typeSource : typeSource;
	if ( typeDestination == '0' || typeDestination == '1' )
	{
		return ( typeSource == '0' || typeSource == '1' || typeSource == '?' );
	}
	else if ( typeDestination == '?' )
	{
		return true;
	}
	return typeSource == '2' || typeSource == '?';
};
