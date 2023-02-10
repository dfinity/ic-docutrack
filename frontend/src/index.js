/* A simple webapp that authenticates the user with Internet Identity and that
 * then calls the backend canister to check the user's principal.
 */

import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { createActor, canisterId as backendCanisterId } from "./declarations/backend/index.js";

let backendService = createActor(backendCanisterId);

window.onload = async () => {
  /*console.log("checking local");
  console.log(localStorage.getItem("authInProgress"));
  if (localStorage.getItem("authInProgress") == "1") {
    console.log("skipping onload");
    return
  }*/

  console.log("running onload");
  const authClient = await AuthClient.create();
  if (await authClient.isAuthenticated()) {
    console.log("logged in");
    console.log(authClient.getIdentity().getPrincipal());
    console.log(authClient.getIdentity().getPrincipal());
    document.getElementById("loginBtn").hidden = true;
    document.getElementById("logoutBtn").hidden = false;

    const identity = authClient.getIdentity();
    document.getElementById("loginStatus").innerText = `Hello ${identity.getPrincipal()}`;
    backendService = createActor(backendCanisterId, {
      agent: new HttpAgent({identity})
    });

    document.getElementById("loggedInOnly").hidden = false;
    document.getElementById("loggedOutOnly").hidden = true;
    await getFiles(backendService);
  } else {
    console.log("not logged in");
    document.getElementById("loginBtn").hidden = false;
    document.getElementById("loginStatus").innerText = "Not logged in."
    document.getElementById("filesList").innerText = "No files to show.";
    document.getElementById("loggedInOnly").hidden = true;
    document.getElementById("loggedOutOnly").hidden = false;
  }
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await (await AuthClient.create()).logout();
  window.location.reload();
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  //localStorage.setItem("authInProgress", "1");
  //console.log(localStorage.getItem("authInProgress"));
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

  localStorage.removeItem("authInProgress");

  // At this point we're authenticated, and we can get the identity from the auth client:
  const identity = authClient.getIdentity();
  // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
  const agent = new HttpAgent({ identity });
  // Using the interface description of our webapp, we create an actor that we use to call the service methods.
  const backend = createActor(backendCanisterId, {
    agent
  });

  await backend.set_user({
    'first_name': 'First name',
    'last_name': 'Last name',
    'public_key': Uint8Array.from([1,2,3])
  });


  // Call the backend which returns a message with the principal (user id) of the current user.
  console.log(await backend.who_am_i());
  document.getElementById("loginStatus").innerText = `Hello ${identity.getPrincipal()}`;
  document.getElementById("loggedInOnly").hidden = false;
  document.getElementById("loggedOutOnly").hidden = true;
  document.getElementById("loginBtn").hidden = true;
  document.getElementById("logoutBtn").hidden = false;
  await getFiles(backend);

  backendService = backend;
});

async function getFiles(backend) {
  const files = await backend.get_files();
  if (files.length == 0) {
    document.getElementById("filesList").innerText = "No files to show.";
  } else {
    document.getElementById("filesList").innerText = "";
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
}

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
