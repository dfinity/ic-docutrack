use crate::{FileContent, FileStatus, PublicFileMetadata, PublicUser, State};
use ic_cdk::export::candid::Principal;

pub fn get_requests(state: &State, caller: Principal) -> Vec<PublicFileMetadata> {
    match state.file_owners.get(&caller) {
        None => vec![],
        Some(file_ids) => file_ids
            .iter()
            .map(|file_id| PublicFileMetadata {
                file_id: *file_id,
                file_name: state
                    .file_data
                    .get(file_id)
                    .expect("file must exist")
                    .metadata
                    .file_name
                    .clone(),
                shared_with: get_allowed_users(state, *file_id),
                file_status: get_file_status(state, *file_id),
            })
            .collect(),
    }
}

pub fn get_allowed_users(state: &State, file_id: u64) -> Vec<PublicUser> {
    state
        .file_shares
        .iter()
        .filter(|element| element.1.contains(&file_id))
        .map(|(user_principal, _file_vector)| {
            let user = state.users.get(user_principal).unwrap().clone();
            PublicUser {
                username: user.username,
                public_key: user.public_key,
                ic_principal: *user_principal,
            }
        })
        .collect()
}

pub fn get_file_status(state: &State, file_id: u64) -> FileStatus {
    // unwrap is safe, we know the file exists
    let file = &state.file_data.get(&file_id).unwrap();
    match &file.content {
        FileContent::Pending { alias } => FileStatus::Pending {
            alias: alias.clone(),
            requested_at: file.metadata.requested_at,
        },
        FileContent::PartiallyUploaded { .. } => FileStatus::PartiallyUploaded,
        FileContent::Uploaded {
            owner_key: own_key, ..
        } => FileStatus::Uploaded {
            uploaded_at: file.metadata.uploaded_at.unwrap(),
            document_key: own_key.clone(),
        },
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{
        api::{request_file, set_user_info},
        get_time, User,
    };
    use ic_cdk::export::Principal;

    #[test]
    fn get_files_test() {
        let mut state = State::default();
        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        // Request a file.
        let alias1 = request_file(Principal::anonymous(), "request", &mut state);
        // Request a file.
        let alias2 = request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        let alias3 = request_file(Principal::anonymous(), "request3", &mut state);
        // Request a file.
        let alias4 = request_file(Principal::anonymous(), "request4", &mut state);

        // We assume here that the file id generation starts at 0 and continues
        // incrementing the id while files are requested.
        assert_eq!(
            get_requests(&state, Principal::anonymous()),
            vec![
                PublicFileMetadata {
                    file_id: 0,
                    file_name: "request".to_string(),
                    file_status: FileStatus::Pending {
                        alias: alias1,
                        requested_at: get_time()
                    },
                    shared_with: vec![]
                },
                PublicFileMetadata {
                    file_id: 1,
                    file_name: "request2".to_string(),
                    file_status: FileStatus::Pending {
                        alias: alias2,
                        requested_at: get_time()
                    },
                    shared_with: vec![]
                },
                PublicFileMetadata {
                    file_id: 2,
                    file_name: "request3".to_string(),
                    file_status: FileStatus::Pending {
                        alias: alias3,
                        requested_at: get_time()
                    },
                    shared_with: vec![]
                },
                PublicFileMetadata {
                    file_id: 3,
                    file_name: "request4".to_string(),
                    file_status: FileStatus::Pending {
                        alias: alias4,
                        requested_at: get_time()
                    },
                    shared_with: vec![]
                }
            ]
        );
    }
}
