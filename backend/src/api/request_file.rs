use crate::{get_time, File, FileContent, FileMetadata, State};
use ic_cdk::export::Principal;

use super::user_info::get_user_key;

/// Requests a file,
pub fn request_file<S: Into<String>>(
    caller: Principal,
    request_name: S,
    state: &mut State,
) -> String {
    // TODO: verify that file alias has not been used before.
    let alias = state.alias_generator.next();

    let file_id = state.generate_file_id();

    let file = File {
        metadata: FileMetadata {
            file_name: request_name.into(),
            user_public_key: get_user_key(state, caller),
            requester_principal: caller,
            requested_at: get_time(),
            uploaded_at: None,
        },
        content: FileContent::Pending {
            alias: alias.clone(),
        },
    };

    state.file_data.insert(file_id, file);

    state.file_alias_index.insert(alias.clone(), file_id);

    // The caller is the owner of this file.
    state
        .file_owners
        .entry(caller)
        .or_insert_with(Vec::new)
        .push(file_id);

    alias
}

#[cfg(test)]
mod test {
    use crate::{api::set_user_info, User};

    use super::*;
    use maplit::btreemap;

    #[test]
    fn requesting_a_file_updates_file_data_and_owners() {
        let mut state = State::default();
        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );
        request_file(Principal::anonymous(), "request".to_string(), &mut state);

        assert_eq!(
            state.file_data,
            btreemap! {
                0 => File {
                    metadata: FileMetadata {
                        file_name: "request".to_string(),
                        user_public_key: get_user_key(&state, Principal::anonymous()),
                        requester_principal: Principal::anonymous(),
                        requested_at: get_time(),
                        uploaded_at: None,
                    },
                    content: FileContent::Pending { alias: "puzzling-mountain".to_string() }
                }
            }
        );

        assert_eq!(
            state.file_owners,
            btreemap! {
                Principal::anonymous() => vec![0],
            }
        );
    }

    #[test]
    fn file_id_is_incrementing() {
        let mut state = State::default();
        set_user_info(
            &mut state,
            Principal::anonymous(),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );
        request_file(Principal::anonymous(), "request".to_string(), &mut state);
        assert_eq!(state.file_count, 1);
        request_file(Principal::anonymous(), "request".to_string(), &mut state);
        assert_eq!(state.file_count, 2);

        assert_eq!(
            state.file_owners,
            btreemap! {
                Principal::anonymous() => vec![0, 1],
            }
        );
    }
}
