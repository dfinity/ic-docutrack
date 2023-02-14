use crate::{FileSharingResponse, PublicFileMetadata, State};
use ic_cdk::export::candid::Principal;

use super::get_files::{get_allowed_users, get_file_status};

pub fn share_file(
    state: &mut State,
    caller: Principal,
    sharing_with: Principal,
    file_id: u64,
) -> FileSharingResponse {
    if !can_share(state, caller, file_id) {
        FileSharingResponse::PermissionError
    } else {
        state
            .file_shares
            .entry(sharing_with)
            .or_insert_with(Vec::new)
            .push(file_id);
        FileSharingResponse::Ok
    }
}

fn can_share(state: &State, user: Principal, file_id: u64) -> bool {
    match state.file_owners.get(&user) {
        None => false,
        Some(arr) => arr.contains(&file_id),
    }
}

pub fn revoke_share(
    state: &mut State,
    caller: Principal,
    sharing_with: Principal,
    file_id: u64,
) -> FileSharingResponse {
    if !can_share(state, caller, file_id) {
        FileSharingResponse::PermissionError
    } else {
        match state.file_shares.get_mut(&sharing_with) {
            None => FileSharingResponse::PermissionError,
            Some(arr) => {
                arr.retain(|&val| val != file_id);
                FileSharingResponse::Ok
            }
        }
    }
}

pub fn get_shared_files(state: &State, caller: Principal) -> Vec<PublicFileMetadata> {
    match state.file_shares.get(&caller) {
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

#[cfg(test)]
mod test {
    use super::*;
    use crate::{
        api::{request_file, set_user_info},
        FileStatus, PublicFileMetadata, User,
    };
    use ic_cdk::export::Principal;

    #[test]
    fn share_files_test() {
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

        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                first_name: "John".to_string(),
                last_name: "Smith".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        // Request a file.
        let alias1 = request_file(Principal::anonymous(), "request", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        let alias3 = request_file(Principal::anonymous(), "request3", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request4", &mut state);

        // share file index 0
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            0,
        );
        // share file index 2
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            2,
        );

        // check if both files are shared correctly
        assert_eq!(
            get_shared_files(&state, Principal::from_slice(&[0, 1, 2])),
            vec![
                PublicFileMetadata {
                    file_id: 0,
                    file_name: "request".to_string(),
                    file_status: FileStatus::Pending { alias: alias1 },
                    shared_with: vec![User {
                        first_name: "John".to_string(),
                        last_name: "Smith".to_string(),
                        public_key: vec![1, 2, 3],
                    }]
                },
                PublicFileMetadata {
                    file_id: 2,
                    file_name: "request3".to_string(),
                    file_status: FileStatus::Pending { alias: alias3 },
                    shared_with: vec![User {
                        first_name: "John".to_string(),
                        last_name: "Smith".to_string(),
                        public_key: vec![1, 2, 3],
                    }]
                },
            ]
        );
    }
    #[test]
    fn share_files_allowed() {
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

        // share file index 2, should not be allowed
        assert_eq!(
            share_file(
                &mut state,
                Principal::anonymous(),
                Principal::from_slice(&[0, 1, 2]),
                2,
            ),
            FileSharingResponse::PermissionError
        );
    }

    #[test]
    fn revoke_files_test() {
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

        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                first_name: "John".to_string(),
                last_name: "Smith".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        // Request a file.
        let _alias1 = request_file(Principal::anonymous(), "request", &mut state);
        // Request a file.
        let _alias2 = request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        let alias3 = request_file(Principal::anonymous(), "request3", &mut state);
        // Request a file.
        let _alias4 = request_file(Principal::anonymous(), "request4", &mut state);

        // share file index 0
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            0,
        );
        // share file index 2
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            2,
        );

        // revoke share for file index 0
        revoke_share(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            0,
        );

        // Check if only file index 2 is still shared
        assert_eq!(
            get_shared_files(&state, Principal::from_slice(&[0, 1, 2])),
            vec![PublicFileMetadata {
                file_id: 2,
                file_name: "request3".to_string(),
                file_status: FileStatus::Pending { alias: alias3 },
                shared_with: vec![User {
                    first_name: "John".to_string(),
                    last_name: "Smith".to_string(),
                    public_key: vec![1, 2, 3],
                }]
            },]
        );
    }
    #[test]
    fn revoke_share_allowed() {
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

        // revoke share of file index 2 should not be allowed
        assert_eq!(
            revoke_share(
                &mut state,
                Principal::anonymous(),
                Principal::from_slice(&[0, 1, 2]),
                2,
            ),
            FileSharingResponse::PermissionError
        );
    }
    #[test]
    fn revoke_not_shared_file() {
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

        // share file index 0
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            0,
        );

        // revoke share with user who was not shared with should not work
        assert_eq!(
            revoke_share(
                &mut state,
                Principal::anonymous(),
                Principal::from_slice(&[0, 1, 3]),
                0,
            ),
            FileSharingResponse::PermissionError
        );
    }
}
