use ic_stable_structures::DefaultMemoryImpl;

use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    Memory as MemoryTrait,
};
use std::cell::RefCell;

const USERS: MemoryId = MemoryId::new(0);
const FILES: MemoryId = MemoryId::new(1);
const FILES_ALIAS_INDEX: MemoryId = MemoryId::new(2);

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY: RefCell<Option<InnerMemory>> = RefCell::new(Some(InnerMemory::default()));

    static MEMORY_MANAGER: RefCell<Option<MemoryManager<InnerMemory>>> =
        RefCell::new(Some(MemoryManager::init(MEMORY.with(|m| m.borrow().clone().unwrap()))));
}

fn with_memory_manager<R>(f: impl FnOnce(&MemoryManager<InnerMemory>) -> R) -> R {
    MEMORY_MANAGER.with(|cell| {
        f(cell
            .borrow()
            .as_ref()
            .expect("memory manager not initialized"))
    })
}

pub fn with_memory_manager_mut<R>(f: impl FnOnce(&mut MemoryManager<InnerMemory>) -> R) -> R {
    MEMORY_MANAGER.with(|cell| {
        f(cell
            .borrow_mut()
            .as_mut()
            .expect("memory manager not initialized"))
    })
}

pub fn get_memory() -> InnerMemory {
    MEMORY.with(|m| m.borrow().clone().expect("memory not initialized"))
}

pub fn get_users_memory() -> Memory {
    with_memory_manager(|m| m.get(USERS))
}

pub fn get_files_memory() -> Memory {
    with_memory_manager(|m| m.get(FILES))
}

pub fn get_file_alias_index_memory() -> Memory {
    with_memory_manager(|m| m.get(FILES_ALIAS_INDEX))
}
