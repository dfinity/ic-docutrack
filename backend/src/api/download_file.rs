use crate::{FileData, State};
use ic_cdk::export::Principal;

fn get_file_data(s: &State, file_id: u64) -> FileData {
    // unwrap is safe because we already know the file exists
    let this_file = s.file_data.get(&file_id).unwrap();
    let file_contents = &this_file.contents;
    match file_contents {
        None => FileData::NotUploadedFile,
        Some(vec) => FileData::FoundFile(vec.clone()),
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
