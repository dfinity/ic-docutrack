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
fn get_files() -> Vec<PublicFileMetadata> {
    with_state(|s| backend::api::get_files(s, caller()))
}

#[query]
fn get_alias_info(alias: String) -> Result<AliasInfo, GetAliasInfoError> {
    with_state(|s| {
        s.file_alias_index
            .get(&alias)
            .ok_or(GetAliasInfoError::NotFound)
            .map(|file_id| AliasInfo {
                file_id: *file_id,
                file_name: s.file_data.get(file_id).unwrap().metadata.file_name.clone(),
                user_public_key: s
                    .file_data
                    .get(file_id)
                    .unwrap()
                    .metadata
                    .user_public_key
                    .clone(),
            })
    })
}

#[update]
fn upload_file(file_id: u64, contents: Vec<u8>) -> Result<(), UploadFileError> {
    with_state_mut(|s| backend::api::upload_file(file_id, contents, s))
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
fn download_file(file_id: u64) -> FileData {
    with_state(|s| backend::api::download_file(s, file_id, caller()))
}

#[update]
fn share_file(user_id: Principal, file_id: u64) -> FileSharingResponse {
    with_state_mut(|s| backend::api::share_file(s, caller(), user_id, file_id))
}

fn main() {}
