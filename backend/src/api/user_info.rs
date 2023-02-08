use crate::{State, User};
use ic_cdk::export::candid::Principal;

pub fn set_user_info(state: &mut State, caller: Principal, user: User) {
    state.users.insert(caller, user);
}

pub fn get_user_key(state: &State, caller: Principal) -> Vec<u8> {
    // assumes the user data is already set
    state
        .users
        .get(&caller)
        .expect("user does not exist.")
        .public_key
        .clone()
}
