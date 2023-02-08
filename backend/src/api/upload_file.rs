use crate::{FileContent, State, UploadFileResponse};
use ic_cdk::export::Principal;

pub fn upload_file(
    _caller: Principal,
    file_id: u64,
    contents: Vec<u8>,
    state: &mut State,
) -> UploadFileResponse {
    // TODO: check if the user has permission.

    // Fetch the file.
    let file = match state.file_data.get_mut(&file_id) {
        Some(file) => file,
        None => return UploadFileResponse::NotRequested,
    };

    // Retrieve the alias associated with the file.
    let alias = match file.content {
        FileContent::Pending { ref alias } => {
            let alias = alias.clone();
            file.content = FileContent::Uploaded { contents };
            alias
        }
        FileContent::Uploaded { .. } => return UploadFileResponse::AlreadyUploaded,
    };

    // The file is now uploaded. Delete the alias from the state.
    state
        .file_alias_index
        .remove(&alias)
        .expect("alias must exist");

    UploadFileResponse::Ok
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{api::request_file, File, FileMetadata};
    use maplit::btreemap;

    #[test]
    fn stored_file_in_state() {
        let mut state = State::default();

        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // The alias index is not empty.
        assert!(!state.file_alias_index.is_empty());

        // Upload the file, which we assume to have a file ID of zero.
        let file_id = 0;
        upload_file(Principal::anonymous(), file_id, vec![1, 2, 3], &mut state);

        // The file is stored in the state.
        assert_eq!(
            state.file_data,
            btreemap! {
                file_id => File {
                    metadata: FileMetadata {
                        file_name: "request".to_string(),
                    },
                    content: FileContent::Uploaded {
                        contents: vec![1,2,3]
                    }
                }
            }
        );

        // The alias index is empty.
        assert!(state.file_alias_index.is_empty());
    }
}
