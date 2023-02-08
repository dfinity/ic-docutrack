use crate::{State, User};
use ic_cdk::export::candid::Principal;

pub fn set_user_info(
    state: &mut State,
    caller: Principal,
    first_name: String,
    last_name: String,
    public_key: Vec<u8>,
) {
    state.users.insert(
        caller,
        User {
            first_name,
            last_name,
            public_key,
        },
    );
}

pub fn get_user_key(state: &State, caller: Principal) -> Vec<u8> {
    // assumes the user data is already set
    state.users.get(&caller).unwrap().public_key.clone()
}
