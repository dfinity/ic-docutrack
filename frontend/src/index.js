/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the backend canister to check the user's principal.
 */

import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as backendCanisterId } from "./declarations/backend/index.js";

let backendService = () => {
  createActor(backendCanisterId);
}

window.onload = async () => {
  const authClient = await AuthClient.create();
  console.log(authClient.isAuthenticated());
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  // When the user clicks, we start the login process.
  // First we have to create and AuthClient.
  const authClient = await AuthClient.create();

  // Find out which URL should be used for login.
  let iiUrl;
  if (process.env.DFX_NETWORK === "local") {
    iiUrl = `http://localhost:4943/?canisterId=${process.env.II_CANISTER_ID}`;
  } else if (process.env.DFX_NETWORK === "ic") {
    iiUrl = `https://${process.env.II_CANISTER_ID}.ic0.app`;
  }

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

  await backend.set_user({
    'first_name': 'Islam',
    'last_name': 'El-Ashi',
    'public_key': Uint8Array.from([1,2,3])
  });

  // Call the backend which returns a message with the principal (user id) of the current user.
  document.getElementById("loginStatus").innerText = await backend.who_am_i();

  const files = await backend.get_files();
  if (files.length == 0) {
    document.getElementById("filesList").innerText = "No files to show.";
  } else {
    files.forEach((file) => {
      const a = document.createElement("a");
      a.innerText = file.file_name;
      a.href = "#";
      a.onclick = async () => {
        // Download the file.
        const downloadFileResponse = await backendService.download_file(file.file_id);

        const data = downloadFileResponse.found_file;
        const content = new Blob([data.buffer], { type: "application/pdf"});

        const encodedUri = window.URL.createObjectURL(content);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("target", "_blank");
        link.click();
      };
      document.getElementById("filesList").appendChild(a);
      document.getElementById("filesList").appendChild(document.createElement("br"));
    })
  }

  backendService = backend;
});

document.getElementById("createRequestBtn").addEventListener("click", async () => {
  const alias = await backendService.request_file(document.getElementById("file_name").value);
  document.getElementById("createRequestResult").innerText = `Request created successfully.
  Alias: ${alias}`;
});

document.getElementById("uploadBtn").addEventListener("click", async () => {
  // Read the file.
  const fileSelector = document.getElementById("file-selector");
  const fileBytes = await fileSelector.files[0].arrayBuffer();

  console.log(`file bytes: ${fileBytes}`);
  console.log(fileBytes);

  // Retrieve alias info.
  const alias = document.getElementById("alias").value;
  console.log(`alias: ${alias}`);
  const aliasInfo = await backendService.get_alias_info(alias);
  console.log(aliasInfo);
  console.log(aliasInfo.Ok.file_id);

  // Upload file
  console.log("uploading file...");
  console.log(await backendService.upload_file(aliasInfo.Ok.file_id, new Uint8Array(fileBytes)));
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  // Download the file.
  const downloadFileResponse = await backendService.download_file(0n);

  const data = downloadFileResponse.found_file;
  const content = new Blob([data.buffer], { type: "application/pdf"});

  const encodedUri = window.URL.createObjectURL(content);
  const link = document.getElementById("downloadLink");
  link.setAttribute("href", encodedUri);
});
