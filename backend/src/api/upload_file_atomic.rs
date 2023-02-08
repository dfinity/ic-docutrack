use crate::{File, FileContent, FileMetadata, State};
use ic_cdk::export::{candid::CandidType, Principal};
use serde::{Deserialize, Serialize};

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq, Eq)]
pub struct UploadFileAtomicRequest {
    name: String,
    content: Vec<u8>,
}

pub fn upload_file_atomic(caller: Principal, request: UploadFileAtomicRequest, state: &mut State) {
    let file_id = state.generate_file_id();

    let old_value = state.file_data.insert(
        file_id,
        File {
            metadata: FileMetadata {
                file_name: request.name,
            },
            content: FileContent::Uploaded {
                contents: request.content,
            },
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
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{File, FileMetadata};
    use maplit::btreemap;

    #[test]
    fn stores_file_in_state() {
        let mut state = State::default();

        // Request a file.
        upload_file_atomic(
            Principal::anonymous(),
            UploadFileAtomicRequest {
                name: "file_name".to_string(),
                content: vec![1, 2, 3],
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
                    },
                    content: FileContent::Uploaded {
                        contents: vec![1,2,3]
                    }
                }
            }
        );

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
