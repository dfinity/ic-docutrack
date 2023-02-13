use ic_stable_structures::DefaultMemoryImpl;

use ic_stable_structures::{
    memory_manager::{MemoryId, MemoryManager, VirtualMemory},
    Memory as MemoryTrait,
};
use std::cell::RefCell;

const WASM_PAGE_SIZE: u64 = 65536;

const USERS: MemoryId = MemoryId::new(0);
const FILES: MemoryId = MemoryId::new(1);
const FILES_ALIAS_INDEX: MemoryId = MemoryId::new(2);

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

thread_local! {
    static MEMORY: RefCell<Option<DefaultMemoryImpl>> = RefCell::new(Some(DefaultMemoryImpl::default()));

    static MEMORY_MANAGER: RefCell<Option<MemoryManager<DefaultMemoryImpl>>> =
        RefCell::new(Some(MemoryManager::init(MEMORY.with(|m| m.borrow().clone().unwrap()))));
}

fn with_memory_manager<R>(f: impl FnOnce(&MemoryManager<DefaultMemoryImpl>) -> R) -> R {
    MEMORY_MANAGER.with(|cell| {
        f(cell
            .borrow()
            .as_ref()
            .expect("memory manager not initialized"))
    })
}

pub fn with_memory_manager_mut<R>(f: impl FnOnce(&mut MemoryManager<DefaultMemoryImpl>) -> R) -> R {
    MEMORY_MANAGER.with(|cell| {
        f(cell
            .borrow_mut()
            .as_mut()
            .expect("memory manager not initialized"))
    })
}

pub fn get_memory() -> DefaultMemoryImpl {
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

/// Writes the bytes at the specified offset, growing the memory size if needed.
pub fn write<M: MemoryTrait>(memory: &M, offset: u64, bytes: &[u8]) {
    let last_byte = offset
        .checked_add(bytes.len() as u64)
        .expect("Address space overflow");

    let size_pages = memory.size();
    let size_bytes = size_pages
        .checked_mul(WASM_PAGE_SIZE)
        .expect("Address space overflow");

    if size_bytes < last_byte {
        let diff_bytes = last_byte - size_bytes;
        let diff_pages = diff_bytes
            .checked_add(WASM_PAGE_SIZE - 1)
            .expect("Address space overflow")
            / WASM_PAGE_SIZE;
        if memory.grow(diff_pages) == -1 {
            panic!(
                "Failed to grow memory from {} pages to {} pages (delta = {} pages).",
                size_pages,
                size_pages + diff_pages,
                diff_pages
            );
        }
    }
    memory.write(offset, bytes);
}
