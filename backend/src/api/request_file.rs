use crate::{File, FileMetadata, State};
use ic_cdk::export::Principal;

/// Requests a file,
pub fn request_file(caller: Principal, request_name: String, state: &mut State) -> String {
    // Get the file ID and increment the one in the state.
    let file_id = state.file_count;
    state.file_count += 1;

    let file = File {
        metadata: FileMetadata {
            file_name: request_name,
        },
        contents: None,
    };

    state.file_data.insert(file_id, file);

    // TODO: verify that file alias has not been used before.
    let alias = state.alias_generator.next();
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
                    contents: None
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
