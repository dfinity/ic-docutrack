use crate::{FileContent, FileData, State};
use ic_cdk::export::candid::Principal;

fn get_file_data(s: &State, file_id: u64) -> FileData {
    // unwrap is safe because we already know the file exists
    let this_file = s.file_data.get(&file_id).unwrap();
    match &this_file.content {
        FileContent::Pending { .. } => FileData::NotUploadedFile,
        FileContent::Uploaded { contents } => FileData::FoundFile(contents.clone()),
    }
}

pub fn download_file(s: &State, file_id: u64, caller: Principal) -> FileData {
    match s.file_owners.get(&caller) {
        None => FileData::PermissionError,
        Some(files) => match files.contains(&file_id) {
            true => get_file_data(s, file_id),
            false => FileData::PermissionError,
        },
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{api::request_file, api::upload_file};
    use ic_cdk::export::Principal;

    #[test]
    fn test_user_not_allowed() {
        let mut state = State::default();
        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // try to download file as different user
        let result = download_file(&state, 0, Principal::from_slice(&[0, 1, 2]));

        assert!(result == FileData::PermissionError);
    }

    #[test]
    fn test_user_does_not_have_file() {
        let mut state = State::default();
        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);
        // Request a file.
        request_file(Principal::anonymous(), "request2", &mut state);
        // Request a file.
        request_file(Principal::from_slice(&[0, 1, 2]), "request3", &mut state);
        // Request a file.
        request_file(Principal::from_slice(&[0, 1, 2]), "request4", &mut state);

        // try to download a file that belongs to another user
        let result = download_file(&state, 3, Principal::anonymous());

        assert!(result == FileData::PermissionError);
    }

    #[test]
    fn test_file_not_uploaded() {
        let mut state = State::default();
        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // try to download a file that was not uploaded yet
        let result = download_file(&state, 0, Principal::anonymous());

        assert!(result == FileData::NotUploadedFile);
    }

    #[test]
    fn test_file_downloads_correctly() {
        let mut state = State::default();

        // Request a file.
        request_file(Principal::anonymous(), "request", &mut state);

        // Upload the file, which we assume to have a file ID of zero.
        let file_id = 0;
        let _alias = upload_file(file_id, vec![1, 2, 3], &mut state);

        assert_eq!(
            download_file(&state, file_id, Principal::anonymous()),
            FileData::FoundFile(vec![1, 2, 3])
        );
    }
}
