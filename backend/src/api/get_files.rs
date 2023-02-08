use crate::{PublicFileMetadata, State};
use ic_cdk::export::candid::Principal;

pub fn get_files(state: &State, caller: Principal) -> Vec<PublicFileMetadata> {
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
            })
            .collect(),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{
        api::{request_file, set_user_info},
        User,
    };
    use ic_cdk::export::Principal;

    #[test]
    fn get_files_test() {
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
        // Request a file.
        request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request3", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request4", &mut state);

        // We assume here that the file id generation starts at 0 and continues
        // incrementing the id while files are requested.
        assert_eq!(
            get_files(&state, Principal::anonymous()),
            vec![
                PublicFileMetadata {
                    file_id: 0,
                    file_name: "request".to_string()
                },
                PublicFileMetadata {
                    file_id: 1,
                    file_name: "request2".to_string()
                },
                PublicFileMetadata {
                    file_id: 2,
                    file_name: "request3".to_string()
                },
                PublicFileMetadata {
                    file_id: 3,
                    file_name: "request4".to_string()
                }
            ]
        );
    }
}
