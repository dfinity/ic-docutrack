use crate::{GetUsersResponse, PublicUser, State};
use ic_cdk::export::candid::Principal;

pub fn get_users(state: &State, caller: Principal) -> GetUsersResponse {
    const ANON_USER: Principal = Principal::anonymous();
    match caller {
        ANON_USER => GetUsersResponse::PermissionError,
        _ => GetUsersResponse::Users(
            state
                .users
                .iter()
                .map(|val| PublicUser {
                    username: val.1.username.clone(),
                    public_key: val.1.public_key.clone(),
                    ic_principal: *val.0,
                })
                .collect(),
        ),
    }
}

#[cfg(test)]
mod test {
    use crate::{
        api::{get_users, set_user_info},
        GetUsersResponse, State, User,
    };
    use candid::Principal;

    #[test]
    fn test_get_users() {
        let mut state = State::default();
        // set 1st user
        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );
        // set 2nd user
        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 3]),
            User {
                username: "John".to_string(),
                public_key: vec![3, 2, 3],
            },
        );
        // set 3rd user
        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 4]),
            User {
                username: "Mike".to_string(),
                public_key: vec![1, 6, 3],
            },
        );

        let users = get_users(&state, Principal::from_slice(&[0, 1, 4]));
        let resp_len = match users {
            GetUsersResponse::PermissionError => 0,
            GetUsersResponse::Users(arr) => arr.len(),
        };
        assert_eq!(resp_len, 3);
    }

    #[test]
    fn test_get_users_permission() {
        let mut state = State::default();
        // set 1st user
        set_user_info(
            &mut state,
            Principal::from_slice(&[0, 1, 2]),
            User {
                username: "John".to_string(),
                public_key: vec![1, 2, 3],
            },
        );
        let users = get_users(&state, Principal::anonymous());
        assert_eq!(users, GetUsersResponse::PermissionError);
    }
}
