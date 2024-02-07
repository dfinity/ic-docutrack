use rand::{seq::SliceRandom, SeedableRng};
use rand_chacha::ChaCha20Rng;
use std::convert::{TryFrom, TryInto};

// List of English adjective words
const ADJECTIVES: &[&str] = &include!(concat!(env!("OUT_DIR"), "/adjectives.rs"));
// List of English noun words
const NOUNS: &[&str] = &include!(concat!(env!("OUT_DIR"), "/nouns.rs"));

#[derive(Clone, Debug)]
pub struct Randomness([u8; 32]);

impl TryFrom<&[u8]> for Randomness {
    type Error = &'static str;

    fn try_from(value: &[u8]) -> Result<Self, Self::Error> {
        Ok(Randomness(
            value[0..32]
                .try_into()
                .map_err(|_| "Randomness is not 32 bytes")?,
        ))
    }
}

impl Randomness {
    pub fn get(&self) -> [u8; 32] {
        self.0
    }
}

pub struct AliasGenerator {
    rng: ChaCha20Rng,
}

impl AliasGenerator {
    /// Creates a new `AliasGenerator`.
    pub fn new(randomness: Randomness) -> Self {
        Self {
            rng: ChaCha20Rng::from_seed(randomness.get()),
        }
    }

    /// Returns the next unique alias from this `AliasGenerator`.
    pub fn next(&mut self) -> String {
        let adjective = ADJECTIVES.choose(&mut self.rng).unwrap();
        let noun = NOUNS.choose(&mut self.rng).unwrap();
        format!("{adjective}-{noun}")
    }
}
