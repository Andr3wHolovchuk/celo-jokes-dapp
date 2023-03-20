# CELO Jokes DAPP

## Table of Contents

-   [Description](#description)
-   [Demo site](#site-demo)
-   [Technologies](#technologies)
-   [Installation](#installation)
-   [Usage](#usage)
-   [License](#license)

# Description


This is a web application for users to create jokes and react to other's jokes. A dapp has 3 pages: Index, Profile and Category. A user can create/edit/remove his own jokes.

User can see other users profile and jokes by a specific category, but only owner can add new categories.

# Demo site

DEMO LINK [Celo jokes DAPP](https://heartfelt-smakager-8a4db9.netlify.app)

##NOTE
WALLET REQUIRED TO TEST THIS DAPP IS [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)


# Technologies

* [Webpack](https://webpack.js.org)
* [Solidity](https://soliditylang.org)
* [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML)
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
* [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction)
* [jQuery](https://api.jquery.com)

# Installation

Open Terminal {Ctrl+Alt+T}

```sh
https://github.com/Andr3wHolovchuk/celo-jokes-dapp.git
```

```sh
cd celo-jokes-dapp
```

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
cd frontend && npm ci

cd backend && npm ci
```

## Start a development server for the client

```sh
npm run dev
```

## Start a development server

```sh
node index.js
```

## Build

```sh
npm run build
```
# Usage
1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh) from the google chrome store.
2. Create or import a wallet.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.

# Site Overview
## Index Page
On the main page, the user can see the jokes of all users, in addition, he can rate these jokes by liking or disliking them. A joke has its own category, title and the text of the joke itself.

[<p align="center"><img src="images/screen-1.png"/></p>][def]

## Profile Page
On the profile page there are jokes added by the user, and his statistics, namely the number of added jokes, dislikes, likes and rating.

If the user is the owner of the contract, he can add new categories.

[<p align="center"><img src="images/screen-2.png"/></p>][def]

Profile page look from another user.
[<p align="center"><img src="images/screen-8.png"/></p>][def]

Model window for creating a new joke.

[<p align="center"><img src="images/screen-3.png"/></p>][def]

Contract modal window after creating a new joke.

[<p align="center"><img src="images/screen-4.png"/></p>][def]

Category creation modal window.

[<p align="center"><img src="images/screen-5.png"/></p>][def]

## Category Page 

A page with filtered jokes by category.

[<p align="center"><img src="images/screen-6.png"/></p>][def]

---

## License
> [MIT License](https://opensource.org/licenses/MIT) &copy; [LICENSE](LICENSE)

[def]: images