use crate::{FileContent, State, UploadFileError};

pub fn upload_file(
    file_id: u64,
    contents: Vec<u8>,
    file_key: Vec<u8>,
    state: &mut State,
) -> Result<(), UploadFileError> {
    // Fetch the file.
    let file = match state.file_data.get_mut(&file_id) {
        Some(file) => file,
        None => return Err(UploadFileError::NotRequested),
    };

    // Retrieve the alias associated with the file.
    let alias = match file.content {
        FileContent::Pending { ref alias } => {
            let alias = alias.clone();
            file.content = FileContent::Uploaded { contents, file_key };
            alias
        }
        FileContent::Uploaded { .. } => return Err(UploadFileError::AlreadyUploaded),
    };

    // The file is now uploaded. Delete the alias from the state.
    state
        .file_alias_index
        .remove(&alias)
        .expect("alias must exist");

    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{
        api::{request_file, set_user_info, user_info::get_user_key},
        File, FileMetadata, User,
    };
    use ic_cdk::export::Principal;
    use maplit::btreemap;

    #[test]
    fn stored_file_in_state() {
        let mut state = State::default();

        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                first_name: "John".to_string(),
                last_name: "Doe".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // The alias index is not empty.
        assert!(!state.file_alias_index.is_empty());

        // Upload the file, which we assume to have a file ID of zero.
        let file_id = 0;
        let _alias = upload_file(file_id, vec![1, 2, 3], vec![1, 2, 3], &mut state);

        // The file is stored in the state.
        assert_eq!(
            state.file_data,
            btreemap! {
                file_id => File {
                    metadata: FileMetadata {
                        file_name: "request".to_string(),
                        user_public_key: get_user_key(&state, Principal::anonymous()),
                        requester_principal: Principal::anonymous()
                    },
                    content: FileContent::Uploaded {
                        contents: vec![1,2,3],
                        file_key: vec![1,2,3]
                    }
                }
            }
        );

        // The alias index is empty.
        assert!(state.file_alias_index.is_empty());
    }
}
