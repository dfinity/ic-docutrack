use crate::{State, STATE};

pub fn pre_upgrade() {
    // Serialize the state.
    let mut state_bytes = vec![];
    crate::with_state(|state| ciborium::ser::into_writer(state, &mut state_bytes))
        .expect("failed to encode state");

    ic_cdk::storage::stable_save((state_bytes,)).unwrap();
}

pub fn post_upgrade() {
    // Read the bytes
    let state_bytes: Vec<u8> = ic_cdk::storage::stable_restore::<(Vec<u8>,)>().unwrap().0;

    // Deserialize and set the state.
    let state: State = ciborium::de::from_reader(&*state_bytes).expect("failed to decode state");

    STATE.with(|s| *s.borrow_mut() = state);
}
