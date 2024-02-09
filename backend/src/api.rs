mod download_file;
mod get_alias_info;
mod get_requests;
mod get_users;
mod request_file;
mod share_file;
mod upload_file;
mod upload_file_atomic;
mod user_info;

use crate::{FileContent, State, UploadFileContinueRequest};
pub use download_file::download_file;
pub use get_alias_info::get_alias_info;
pub use get_requests::get_requests;
pub use get_users::get_users;
pub use request_file::request_file;
pub use share_file::{get_shared_files, revoke_share, share_file};
pub use upload_file::upload_file;
pub use upload_file_atomic::{upload_file_atomic, UploadFileAtomicRequest};
pub use user_info::set_user_info;
pub use user_info::username_exists;

pub fn upload_file_continue(request: UploadFileContinueRequest, state: &mut State) {
    // Update the file's contents.
    let file_id = request.file_id;
    let chunk_id = request.chunk_id;

    let updated_file_data = match state.file_data.remove(&file_id) {
        Some(mut file) => {
            let updated_contents = match file.content {
                FileContent::PartiallyUploaded {
                    num_chunks,
                    file_type,
                    owner_key,
                    shared_keys,
                } => {
                    // Add the chunk to the partially uploaded file.
                    assert!(chunk_id < num_chunks, "invalid chunk id");
                    assert!(
                        !state.file_contents.contains_key(&(file_id, chunk_id)),
                        "chunk already uploaded"
                    );

                    // Add the chunk.
                    state
                        .file_contents
                        .insert((file_id, chunk_id), request.contents);

                    if state.num_chunks_uploaded(file_id) == num_chunks {
                        // The file is complete. Assemble the file.
                        FileContent::Uploaded {
                            file_type,
                            owner_key,
                            shared_keys,
                            num_chunks,
                        }
                    } else {
                        FileContent::PartiallyUploaded {
                            num_chunks,
                            file_type,
                            owner_key,
                            shared_keys,
                        }
                    }
                }
                f => panic!("expected a partially uploaded file. Found: {f:?}"),
            };

            file.content = updated_contents;
            file
        }
        None => panic!("file doesn't exist"),
    };

    // Insert the file back into the state.
    assert_eq!(state.file_data.insert(file_id, updated_file_data), None);
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::api::user_info::get_user_key;
    use crate::{api::set_user_info, get_time, File, FileMetadata, User};
    use candid::Principal;
    use maplit::btreemap;
    use std::collections::BTreeMap;

    #[test]
    fn chunked_upload() {
        let mut state = State::default();

        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        // Upload the first chunk.
        let file_id = upload_file_atomic(
            Principal::anonymous(),
            UploadFileAtomicRequest {
                num_chunks: 3,
                name: "file_name".to_string(),
                content: vec![1, 2, 3],
                owner_key: vec![1, 2, 3],
                file_type: "image/jpeg".to_string(),
            },
            &mut state,
        );

        // The first chunk is added to the state.
        assert_eq!(
            state.file_data,
            btreemap! {
                0 => File {
                    metadata: FileMetadata {
                        file_name: "file_name".to_string(),
                        user_public_key: get_user_key(&state, Principal::anonymous()),
                        requester_principal: Principal::anonymous(),
                        requested_at: get_time(),
                        uploaded_at: Some(get_time()),
                    },
                    content: FileContent::PartiallyUploaded {
                        num_chunks: 3,
                        file_type: "image/jpeg".to_string(),
                        owner_key: vec![1,2,3],
                        shared_keys: BTreeMap::new()
                    }
                }
            }
        );
        assert_eq!(state.file_contents.get(&(file_id, 0)), Some(vec![1, 2, 3]));
        assert_eq!(state.num_chunks_uploaded(file_id), 1);

        // Upload the second chunk.
        upload_file_continue(
            UploadFileContinueRequest {
                file_id,
                chunk_id: 1,
                contents: vec![4, 5, 6],
            },
            &mut state,
        );

        // The second chunk is added to the state.
        assert_eq!(
            state.file_data,
            btreemap! {
                0 => File {
                    metadata: FileMetadata {
                        file_name: "file_name".to_string(),
                        user_public_key: get_user_key(&state, Principal::anonymous()),
                        requester_principal: Principal::anonymous(),
                        requested_at: get_time(),
                        uploaded_at: Some(get_time()),
                    },
                    content: FileContent::PartiallyUploaded {
                        num_chunks: 3,
                        file_type: "image/jpeg".to_string(),
                        owner_key: vec![1,2,3],
                        shared_keys: BTreeMap::new()
                    }
                }
            }
        );
        assert_eq!(state.file_contents.get(&(file_id, 0)), Some(vec![1, 2, 3]));
        assert_eq!(state.file_contents.get(&(file_id, 1)), Some(vec![4, 5, 6]));
        assert_eq!(state.num_chunks_uploaded(file_id), 2);

        // Upload the third and final chunk.
        upload_file_continue(
            UploadFileContinueRequest {
                file_id,
                chunk_id: 2,
                contents: vec![7, 8, 9, 10],
            },
            &mut state,
        );

        // The last chunk is added to the state.
        assert_eq!(
            state.file_data,
            btreemap! {
                0 => File {
                    metadata: FileMetadata {
                        file_name: "file_name".to_string(),
                        user_public_key: get_user_key(&state, Principal::anonymous()),
                        requester_principal: Principal::anonymous(),
                        requested_at: get_time(),
                        uploaded_at: Some(get_time()),
                    },
                    content: FileContent::Uploaded {
                        file_type: "image/jpeg".to_string(),
                        owner_key: vec![1,2,3],
                        shared_keys: BTreeMap::new(),
                        num_chunks: 3
                    }
                }
            }
        );
        assert_eq!(state.file_contents.get(&(file_id, 0)), Some(vec![1, 2, 3]));
        assert_eq!(state.file_contents.get(&(file_id, 1)), Some(vec![4, 5, 6]));
        assert_eq!(
            state.file_contents.get(&(file_id, 2)),
            Some(vec![7, 8, 9, 10])
        );
        assert_eq!(state.num_chunks_uploaded(file_id), 3);
    }
}
