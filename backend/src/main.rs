use ic_cdk_macros::query;
use ic_cdk_macros::update;

use ic_cdk::export::candid::CandidType;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::BTreeMap;

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct User {
    first_name: String,
    last_name: String,
}

#[derive(CandidType, Serialize, Deserialize)]
enum WhoamiResponse {
    #[serde(rename = "known_user")]
    KnownUser(User),
    #[serde(rename = "unknown_user")]
    UnknownUser,
}

thread_local! {
    /// User name
    static USERS: RefCell<BTreeMap<ic_cdk::export::Principal, User>> = RefCell::new(BTreeMap::new());

}

#[query]
fn hello_world() -> String {
    format!("Hello {}!", ic_cdk::api::caller())
}

#[update]
fn set_user(first_name: String, last_name: String) {
    USERS.with(|users| {
        users.borrow_mut().insert(
            ic_cdk::api::caller(),
            User {
                first_name,
                last_name,
            },
        )
    });
}

#[query]
fn who_am_i() -> WhoamiResponse {
    USERS.with(|users| {
        let users = users.borrow();
        match users.get(&ic_cdk::api::caller()) {
            None => WhoamiResponse::UnknownUser,
            Some(user) => WhoamiResponse::KnownUser(user.clone()),
        }
    })
}

fn main() {}
