use backend::*;
use ic_cdk::api::caller;
use ic_cdk_macros::query;
use ic_cdk_macros::update;

#[query]
fn hello_world() -> String {
    format!("Hello {}!", ic_cdk::api::caller())
}

#[update]
fn set_user(first_name: String, last_name: String) {
    with_state_mut(|s| {
        s.users.insert(
            ic_cdk::api::caller(),
            User {
                first_name,
                last_name,
            },
        );
    });
}

#[query]
fn who_am_i() -> WhoamiResponse {
    with_state(|s| match s.users.get(&ic_cdk::api::caller()) {
        None => WhoamiResponse::UnknownUser,
        Some(user) => WhoamiResponse::KnownUser(user.clone()),
    })
}

#[query]
fn get_files() -> Vec<FileMetadata> {
    with_state(|s| match s.file_owners.get(&caller()) {
        None => vec![],
        Some(file_ids) => file_ids
            .iter()
            .map(|file_id| s.file_data.get(file_id).unwrap().metadata.clone())
            .collect(),
    })
}

#[query]
fn get_alias_info(alias: String) -> GetAliasInfoResponse {
    with_state(|s| match s.file_alias_index.get(&alias) {
        Some(file_id) => GetAliasInfoResponse::Found(AliasInfo {
            file_id: *file_id,
            file_name: s.file_data.get(file_id).unwrap().metadata.file_name.clone(),
        }),
        None => GetAliasInfoResponse::NotFound,
    })
}

#[update]
fn upload_file(file_id: u64, file_content: Vec<u8>) -> UploadFileResponse {
    with_state_mut(|s| match s.file_data.get_mut(&file_id) {
        None => UploadFileResponse::NotRequestedFile,
        Some(file) => {
            let file_contents = &file.contents;
            match file_contents {
                None => {
                    file.contents = Some(file_content.clone());
                    UploadFileResponse::UploadOk
                }
                Some(_vec) => UploadFileResponse::AlreadyUploadedFile,
            }
        }
    })
}

#[update]
fn request_file(request_name: String) -> String {
    with_state_mut(|s| backend::api::request_file(caller(), request_name, s))
}

#[query]
fn download_file(file_id: u64) -> FileData {
    with_state(|s| match s.file_data.get(&file_id) {
        None => FileData::NotFoundFile,
        Some(file) => {
            let file_contents = &file.contents;
            match file_contents {
                None => FileData::NotUploadedFile,
                Some(vec) => FileData::FoundFile(vec.clone()),
            }
        }
    })
}

fn main() {}
