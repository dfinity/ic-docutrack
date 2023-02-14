use backend::api::UploadFileAtomicRequest;
use backend::*;
use ic_cdk::api::caller;
use ic_cdk::export::candid::Principal;
use ic_cdk_macros::query;
use ic_cdk_macros::update;

#[query]
fn hello_world() -> String {
    format!("Hello {}!", ic_cdk::api::caller())
}

#[update]
fn set_user(user: User) {
    with_state_mut(|s| backend::api::set_user_info(s, caller(), user))
}

#[query]
fn who_am_i() -> WhoamiResponse {
    with_state(|s| match s.users.get(&ic_cdk::api::caller()) {
        None => WhoamiResponse::UnknownUser,
        Some(user) => WhoamiResponse::KnownUser(user.clone()),
    })
}

#[query]
fn get_requests() -> Vec<PublicFileMetadata> {
    with_state(|s| backend::api::get_requests(s, caller()))
}

#[query]
fn get_alias_info(alias: String) -> Result<AliasInfo, GetAliasInfoError> {
    with_state(|s| backend::api::get_alias_info(s, alias))
}

#[update]
fn upload_file(file_id: u64, contents: Vec<u8>, file_key: Vec<u8>) -> Result<(), UploadFileError> {
    with_state_mut(|s| backend::api::upload_file(file_id, contents, file_key, s))
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
fn share_file(user_id: Principal, file_id: u64) -> FileSharingResponse {
    with_state_mut(|s| backend::api::share_file(s, caller(), user_id, file_id))
}

#[query]
fn get_users() -> GetUsersResponse {
    with_state(|s| backend::api::get_users(s, caller()))
}

fn main() {}
