use backend::api::UploadFileAtomicRequest;
use backend::*;
use ic_cdk::api::caller;
use ic_cdk::export::candid::Principal;
use ic_cdk_macros::{post_upgrade, pre_upgrade, query, update};

#[update]
fn set_user(first_name: String, last_name: String, public_key: Vec<u8>) {
    let user = User {
        first_name,
        last_name,
        public_key,
    };

    with_state_mut(|s| backend::api::set_user_info(s, caller(), user))
}

#[query]
fn who_am_i() -> WhoamiResponse {
    with_state(|s| match s.users.get(&ic_cdk::api::caller()) {
        None => WhoamiResponse::UnknownUser,
        Some(user) => WhoamiResponse::KnownUser(PublicUser {
            first_name: user.first_name.clone(),
            last_name: user.last_name.clone(),
            public_key: user.public_key.clone(),
            ic_principal: ic_cdk::api::caller(),
        }),
    })
}

#[query]
fn get_requests() -> Vec<PublicFileMetadata> {
    with_state(|s| backend::api::get_requests(s, caller()))
}

#[query]
fn get_shared_files() -> Vec<PublicFileMetadata> {
    with_state(|s| backend::api::get_shared_files(s, caller()))
}

#[query]
fn get_alias_info(alias: String) -> Result<AliasInfo, GetAliasInfoError> {
    with_state(|s| backend::api::get_alias_info(s, alias))
}

#[update]
fn upload_file(request: UploadFileRequest) -> Result<(), UploadFileError> {
    with_state_mut(|s| {
        backend::api::upload_file(
            request.file_id,
            request.file_content,
            request.file_type,
            request.owner_key,
            s,
        )
    })
}

#[update]
fn upload_file_atomic(request: UploadFileAtomicRequest) {
    with_state_mut(|s| backend::api::upload_file_atomic(caller(), request, s))
}

#[update]
fn request_file(request_name: String) -> String {
    with_state_mut(|s| backend::api::request_file(caller(), request_name, s))
}

#[query]
fn download_file(file_id: u64) -> FileDownloadResponse {
    with_state(|s| backend::api::download_file(s, file_id, caller()))
}

#[update]
fn share_file(
    user_id: Principal,
    file_id: u64,
    file_key_encrypted_for_user: Vec<u8>,
) -> FileSharingResponse {
    with_state_mut(|s| {
        backend::api::share_file(s, caller(), user_id, file_id, file_key_encrypted_for_user)
    })
}

#[update]
fn share_file_with_users(
    user_id: Vec<Principal>,
    file_id: u64,
    file_key_encrypted_for_user: Vec<Vec<u8>>,
) {
    with_state_mut(|s| {
        for (id, key) in user_id.iter().zip(file_key_encrypted_for_user.iter()) {
            backend::api::share_file(s, caller(), *id, file_id, key.clone());
        }
    });
}

#[update]
fn revoke_share(user_id: Principal, file_id: u64) -> FileSharingResponse {
    with_state_mut(|s| backend::api::revoke_share(s, caller(), user_id, file_id))
}

#[query]
fn get_users() -> GetUsersResponse {
    with_state(|s| backend::api::get_users(s, caller()))
}

#[pre_upgrade]
fn pre_upgrade() {
    backend::pre_upgrade();
}

#[post_upgrade]
fn post_upgrade() {
    backend::post_upgrade();
}

fn main() {}
