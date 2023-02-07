/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the backend canister to check the user's principal.
 */

import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as backendCanisterId } from "./declarations/backend/index.js";

// Autofills the <input> for the II Url to point to the correct canister.
document.body.onload = () => {
  let iiUrl;
  if (process.env.DFX_NETWORK === "local") {
    iiUrl = `http://localhost:4943/?canisterId=${process.env.II_CANISTER_ID}`;
  } else if (process.env.DFX_NETWORK === "ic") {
    iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;
  }
  document.getElementById("iiUrl").value = iiUrl;
};

document.getElementById("loginBtn").addEventListener("click", async () => {
  // When the user clicks, we start the login process.
  // First we have to create and AuthClient.
  const authClient = await AuthClient.create();

  // Find out which URL should be used for login.
  const iiUrl = document.getElementById("iiUrl").value;

  // Call authClient.login(...) to login with Internet Identity. This will open a new tab
  // with the login prompt. The code has to wait for the login process to complete.
  // We can either use the callback functions directly or wrap in a promise.
  await new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: iiUrl,
      onSuccess: resolve,
      onError: reject,
    });
  });

  // At this point we're authenticated, and we can get the identity from the auth client:
  const identity = authClient.getIdentity();
  // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
  const agent = new HttpAgent({ identity });
  // Using the interface description of our webapp, we create an actor that we use to call the service methods.
  const backend = createActor(backendCanisterId, {
    agent
  });
  // Call the backend which returns a message with the principal (user id) of the current user.
  document.getElementById("loginStatus").innerText = await backend.hello_world();
});
