pub use crate::ceil_division;
use crate::{FileContent, FileData, FileDownloadResponse, State};
use ic_cdk::export::candid::Principal;

fn get_file_data(s: &State, file_id: u64, chunk_id: u64) -> FileDownloadResponse {
    // unwrap is safe because we already know the file exists
    let this_file = s.file_data.get(&file_id).unwrap();
    match &this_file.content {
        FileContent::Pending { .. } | FileContent::PartiallyUploaded { .. } => {
            FileDownloadResponse::NotUploadedFile
        }
        FileContent::Uploaded {
            file_type,
            owner_key,
            shared_keys: _,
            num_chunks,
        } => FileDownloadResponse::FoundFile(FileData {
            contents: s.file_contents.get(&(file_id, chunk_id)).unwrap(),
            file_type: file_type.clone(),
            owner_key: owner_key.clone(),
            num_chunks: *num_chunks,
        }),
    }
}

fn get_shared_file_data(
    s: &State,
    file_id: u64,
    chunk_id: u64,
    user: Principal,
) -> FileDownloadResponse {
    // unwrap is safe because we already know the file exists
    let this_file = s.file_data.get(&file_id).unwrap();
    match &this_file.content {
        FileContent::Pending { .. } | FileContent::PartiallyUploaded { .. } => {
            FileDownloadResponse::NotUploadedFile
        }
        FileContent::Uploaded {
            file_type,
            owner_key: _,
            shared_keys,
            num_chunks,
        } => FileDownloadResponse::FoundFile(FileData {
            contents: s.file_contents.get(&(file_id, chunk_id)).unwrap(),
            file_type: file_type.clone(),
            owner_key: shared_keys.get(&user).unwrap().clone(),
            num_chunks: *num_chunks,
        }),
    }
}
pub fn download_file(
    s: &State,
    file_id: u64,
    chunk_id: u64,
    caller: Principal,
) -> FileDownloadResponse {
    match s.file_owners.get(&caller) {
        // This is the case where the files is owned by this user.
        Some(files) => match files.contains(&file_id) {
            true => get_file_data(s, file_id, chunk_id),
            false => {
                if is_file_shared_with_me(s, file_id, caller) {
                    get_shared_file_data(s, file_id, chunk_id, caller)
                } else {
                    FileDownloadResponse::PermissionError
                }
            }
        },
        // But it could also be the case that the file is shared with this user.
        None => {
            if is_file_shared_with_me(s, file_id, caller) {
                get_shared_file_data(s, file_id, chunk_id, caller)
            } else {
                FileDownloadResponse::PermissionError
            }
        }
    }
}

fn is_file_shared_with_me(s: &State, file_id: u64, caller: Principal) -> bool {
    match s.file_shares.get(&caller) {
        None => false,
        Some(arr) => arr.contains(&file_id),
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{
        api::{request_file, share_file},
        api::{set_user_info, upload_file},
        User,
    };
    use ic_cdk::export::Principal;

    #[test]
    fn test_user_not_allowed() {
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
        request_file(Principal::anonymous(), "request", &mut state);

        // try to download file as different user
        let result = download_file(&state, 0, 0, Principal::from_slice(&[0, 1, 2]));

        assert!(result == FileDownloadResponse::PermissionError);
    }

    #[test]
    fn test_user_does_not_have_file() {
        let mut state = State::default();
        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 4],
            },
        );

        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        request_file(Principal::from_slice(&[0, 1, 2]), "request3", &mut state);
        // Request a file.
        request_file(Principal::from_slice(&[0, 1, 2]), "request4", &mut state);

        // try to download a file that belongs to another user
        let result = download_file(&state, 3, 0, Principal::anonymous());

        assert!(result == FileDownloadResponse::PermissionError);
    }

    #[test]
    fn test_file_not_uploaded() {
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
        request_file(Principal::anonymous(), "request", &mut state);

        // try to download a file that was not uploaded yet
        let result = download_file(&state, 0, 0, Principal::anonymous());

        assert!(result == FileDownloadResponse::NotUploadedFile);
    }

    #[test]
    fn test_file_downloads_correctly() {
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
        request_file(Principal::anonymous(), "request", &mut state);

        // Upload the file, which we assume to have a file ID of zero.
        let file_id = 0;
        let _alias = upload_file(
            file_id,
            vec![1, 2, 3],
            "jpeg".to_string(),
            vec![1, 2, 3],
            1,
            &mut state,
        );

        assert_eq!(
            download_file(&state, file_id, 0, Principal::anonymous()),
            FileDownloadResponse::FoundFile(FileData {
                contents: vec![1, 2, 3],
                file_type: "jpeg".to_string(),
                owner_key: vec![1, 2, 3],
                num_chunks: 1
            })
        );
    }

    #[test]
    fn download_shared_file() {
        let mut state = State::default();

        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );

        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 4],
            },
        );

        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // Upload the file, which we assume to have a file ID of zero.
        let _alias = upload_file(
            0,
            vec![1, 2, 3],
            "jpeg".to_string(),
            vec![1, 2, 3],
            1,
            &mut state,
        );

        // share file
        share_file(
            &mut state,
            Principal::anonymous(),
            Principal::from_slice(&[0, 1, 2]),
            0,
            vec![10, 11, 12],
        );

        assert_eq!(
            download_file(&state, 0, 0, Principal::from_slice(&[0, 1, 2])),
            FileDownloadResponse::FoundFile(FileData {
                contents: vec![1, 2, 3],
                file_type: "jpeg".to_string(),
                owner_key: vec![10, 11, 12],
                num_chunks: 1
            })
        )
    }
}
