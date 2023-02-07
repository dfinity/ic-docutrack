use backend::*;
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
fn get_request_info(alias: String) -> FileMetadata {
    with_state(|s| match s.file_alias_index.get(&alias) {
        Some(file_metadata) => file_metadata.clone(),
        None => FileMetadata {
            file_id: 0,
            file_name: "non-existing file".to_string(),
        },
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
fn create_file_request(request_name: String) -> String {
    let crnt_file = with_state_mut(|s| {
        s.file_count += 1;
        s.file_count
    });
    let file_metadata = FileMetadata {
        file_id: crnt_file,
        file_name: request_name,
    };
    let file = File {
        metadata: file_metadata.clone(),
        contents: None,
    };
    with_state_mut(|s| {
        s.file_data.insert(crnt_file, file);
    });
    let alias = generate_alias();
    // TODO: verify that file alias has not been used before.
    with_state_mut(|s| {
        s.file_alias_index.insert(alias.clone(), file_metadata);
    });

    alias
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
