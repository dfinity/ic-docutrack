mod aliases;
use crate::aliases::{AliasGenerator, Randomness};
use std::cell::RefCell;

thread_local! {
    // NOTE: This will be moved into the `State` struct when that's created.
    // TODO: Persist the generator state across upgrades.
    static ALIAS_GENERATOR: RefCell<AliasGenerator> = RefCell::new(AliasGenerator::new(Randomness::try_from(vec![0;32].as_slice()).unwrap()));
}

/// Returns an unused file alias.
pub fn generate_alias() -> String {
    ALIAS_GENERATOR.with(|a| a.borrow_mut().next())
}
