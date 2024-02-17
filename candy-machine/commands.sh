solana-keygen new --outfile C:\Users\ryanm\OneDrive\Documents\GitHub\traders-anonymous\candy-machine\key\creator.json

pubkey: 8oRqttLKDewj14TXtFaGREVrHixXjtr4cXDFi3tQjbB3
============================================================================
Save this seed phrase and your BIP39 passphrase to recover your new keypair:
morning umbrella match dignity term source duck danger wool diet april sport


solana config set --keypair C:\Users\ryanm\OneDrive\Documents\GitHub\traders-anonymous\candy-machine\key\creator.json
solana config set --url https://indulgent-snowy-county.solana-mainnet.discover.quiknode.pro/8f3eb1ab672d396c9d8ecf8a800431a5fd6db349/
solana config get

## Send some SOL to the wallet

## Generate images and add to ./assets/

sugar launch

sugar create-config
sugar validate
sugar upload

Collection mint ID: EMk4ECut7GqtFUsXA7YtYFjKUq2KKX9Ay3gbXfShWsjj
Candy guard ID: F8cAqavK8KrcmD5V7r1zChVPQkmcH6bsgBs4HAoG2Ugh
Candy machine ID: DZcWMrqpW6JbodZGSJCrmYXRgkoznqoLijyYoZcFpzQ9

sugar deploy
sugar verify
sugar guard add

candy guard id: 

"guards": {
    "default": {
      "nftPayment": {
        "requiredCollection": "FKUpejNjZcGTFbf2QjrafyLuE5mh1AU1nNho6V4q8ndf",
        "destination": "6aoj1Pbnnbwy1BvuR5oKB5uQEHezUD7CDeKeiSytNhuZ"
      }

            group: null,
      guards: {
        nftPayment: {
          mint: new PublicKey(nftsInCollection[0].mintAddress),
        }
      }