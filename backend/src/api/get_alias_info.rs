use crate::{AliasInfo, FileMetadata, GetAliasInfoError, State};
use ic_cdk::export::candid::Principal;

pub fn get_alias_info(state: &State, alias: String) -> Result<AliasInfo, GetAliasInfoError> {
    state
        .file_alias_index
        .get(&alias)
        .ok_or(GetAliasInfoError::NotFound)
        .map(|file_id| {
            let file_metadata = get_file_metadata(state, *file_id);
            AliasInfo {
                file_id: *file_id,
                file_name: file_metadata.file_name.clone(),
                user_public_key: file_metadata.user_public_key.clone(),
                requester_name: get_user_name(state, file_metadata.requester_principal),
            }
        })
}

fn get_file_metadata(state: &State, file_id: u64) -> &FileMetadata {
    &state.file_data.get(&file_id).unwrap().metadata
}

fn get_user_name(state: &State, user_principal: Principal) -> String {
    // It's safe to unwrap, we know the file was requested by an existing user.
    let user = state.users.get(&user_principal).unwrap();

    let user_name = format!("{} {}", user.first_name, user.last_name);
    user_name
}
