use crate::{File, FileContent, FileMetadata, State};
use ic_cdk::export::Principal;

/// Requests a file,
pub fn request_file<S: Into<String>>(
    caller: Principal,
    request_name: S,
    state: &mut State,
) -> String {
    // TODO: verify that file alias has not been used before.
    let alias = state.alias_generator.next();

    let file = File {
        metadata: FileMetadata {
            file_name: request_name.into(),
        },
        content: FileContent::Pending {
            alias: alias.clone(),
        },
    };

    let file_id = state.generate_file_id();

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
    use super::*;
    use maplit::btreemap;

    #[test]
    fn requesting_a_file_updates_file_data_and_owners() {
        let mut state = State::default();
        request_file(Principal::anonymous(), "request".to_string(), &mut state);

        assert_eq!(
            state.file_data,
            btreemap! {
                0 => File {
                    metadata: FileMetadata {
                        file_name: "request".to_string(),
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
