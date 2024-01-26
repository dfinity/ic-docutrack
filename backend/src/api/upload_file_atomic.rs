use crate::{get_time, File, FileContent, FileMetadata, State};
use ic_cdk::export::{candid::CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

use super::user_info::get_user_key;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct UploadFileAtomicRequest {
    pub name: String,
    pub content: Vec<u8>,
    pub owner_key: Vec<u8>,
    pub file_type: String,
    pub num_chunks: u64,
}

pub fn upload_file_atomic(
    caller: Principal,
    request: UploadFileAtomicRequest,
    state: &mut State,
) -> u64 {
    let file_id = state.generate_file_id();

    let content = if request.num_chunks == 1 {
        // File is uploaded in one chunk.
        FileContent::Uploaded {
            num_chunks: request.num_chunks,
            file_type: request.file_type,
            owner_key: request.owner_key,
            shared_keys: BTreeMap::new(),
        }
    } else {
        // File will be uploaded in multiple chunks.
        FileContent::PartiallyUploaded {
            num_chunks: request.num_chunks,
            file_type: request.file_type,
            owner_key: request.owner_key,
            shared_keys: BTreeMap::new(),
        }
    };

    // Add file contents to stable store.
    let chunk_id = 0;
    state
        .file_contents
        .insert((file_id, chunk_id), request.content);

    let old_value = state.file_data.insert(
        file_id,
        File {
            metadata: FileMetadata {
                file_name: request.name,
                user_public_key: get_user_key(state, caller),
                requester_principal: caller,
                requested_at: get_time(),
                uploaded_at: Some(get_time()),
            },
            content,
        },
    );

    if old_value.is_some() {
        panic!("Overwriting an existing file should be impossible.");
    }

    // Add the caller as the owner of this file.
    state
        .file_owners
        .entry(caller)
        .or_insert_with(Vec::new)
        .push(file_id);

    file_id
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{api::set_user_info, File, FileMetadata, User};
    use maplit::btreemap;

    #[test]
    fn stores_file_in_state() {
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
        upload_file_atomic(
            Principal::anonymous(),
            UploadFileAtomicRequest {
                num_chunks: 1,
                name: "file_name".to_string(),
                content: vec![1, 2, 3],
                owner_key: vec![1, 2, 3],
                file_type: "image/jpeg".to_string(),
            },
            &mut state,
        );

        // The file is stored in the state.
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
                        num_chunks: 1,
                    }
                }
            }
        );
        assert_eq!(state.file_contents.get(&(0, 0)), Some(vec![1, 2, 3]));

        // The alias index is empty.
        assert!(state.file_alias_index.is_empty());

        // Owners are updated.
        // TODO: test this logic with the get_files endpoint.
        assert_eq!(
            state.file_owners,
            btreemap! {
                Principal::anonymous() => vec![0],
            }
        );
    }
}
