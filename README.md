# ic-docutrack

DocuTrack is a proof-of-concept dapp for sharing and managing documents. You can upload documents and authorize people to access them with a few mouse clicks. Access to shared documents can expire or be explicitly revoked. In addition, you can ask other people to upload documents for you by simply sharing a link (no login required).  Documents are transmitted and stored in encrypted form. The dapp can be used with any standard web browser, no plugins or extensions are needed and no passwords need to be remembered. 

Such a dapp can only be realized on the Internet Computer (IC). It is the only blockchain network that can serve web content directly. Furthermore, its programming model enables such complex applications with privacy-preserving identity management fully on-chain. Last but not least, the IC provides low latency, efficiency and affordable storage facilities.

The documents are encrypted at all times, so no one–including IC node providers– but designated users can decrypt them.
In more detail, DocuTrack demonstrates how a user Alice who created an account with the dapp (using Internet Identity) can ask a Bob to upload documents for her without having to create an account himself. 
This feature makes it very easy and secure for service providers (e.g., a client advisor or wealth manager) to request documents of any type (e.g., house deeds, passport pictures or log files) from clients or other third parties. 
Other document sharing apps require users to exchange public keys or other cryptographic material with which people typically struggle a lot. 

You can try out DocuTrack on https://pxg7f-3yaaa-aaaap-qa6eq-cai.ic0.app/.

The dapp is explained in more detail [here](./documentation.pdf)

## Disclaimer: please read carefully

This is a proof of concept dapp that demonstrates the potential of building confidential document management on the IC. Do not use this code as is for sensitive data as there are the following issues that should be addressed before the dapp can be considered production-ready:

- Users may lose their notes if they accidentally clean the browser data (localStorage) 
- The frontend re-uses the generated public- and private-key pair for every identity in the same browser. In a better implementation, this key pair should be unique per principal and not managed by the browser at all.
- The same user cannot access the docs in another browser because the decryption key will not be available there.
- Lack of key update: Given that the key used to encrypted the files is never refreshed, the privacy of the data is no longer guaranteed if an attacker learns this key (for instance, by corrupting the local storage of one of the users).

The best solution for the first three bullet points is to apply [vetKeys](https://internetcomputer.org/blog/features/vetkey-primer/) to ensure in a clean and robust way that the same key pair can be extracted for each principal, regardless of the machine and browser used to access the dapp. Until this feature is available, key management could be implemented with WebAuthn extensions. However, these approaches are probably rather brittle, due to lacking widespread support in browsers and HW. For the last point, key revocation and/or key rotation should be used.

## Development

To run the dapp locally, run the following in one terminal window:

```
dfx start --clean
```

And in another terminal"

```
# Install needed frontend dependencies.
npm install -g pnpm
pnpm install

# Deploy the canisters.
dfx deploy
dfx deps pull
dfx deps deploy
```

In your browser you can now go to <canister_id>.localhost:8000 to access the frontend.

If you want to contribute, see our [CONTRIBUTING](.github/CONTRIBUTING.md) document to get started.
