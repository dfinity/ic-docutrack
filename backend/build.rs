use std::env;
use std::fs;
use std::io::{self, BufRead, BufReader, BufWriter, Write};
use std::path::Path;

fn generate(src_path: impl AsRef<Path>, dst_path: impl AsRef<Path>) -> io::Result<()> {
    let src = BufReader::new(fs::File::open(src_path.as_ref())?);
    let mut dst = BufWriter::new(fs::File::create(dst_path.as_ref())?);

    writeln!(dst, "[")?;
    for word in src.lines() {
        writeln!(dst, "\"{}\",", &word.unwrap())?;
    }
    writeln!(dst, "]")
}

fn main() -> Result<(), String> {
    let out_dir = env::var_os("OUT_DIR").unwrap();

    let adjectives_path = Path::new(&out_dir).join("adjectives.rs");
    generate("data/adjectives.txt", &adjectives_path).map_err(|err| {
        format!(
            "failed to create list of adjectives from {}: {}",
            adjectives_path.display(),
            err
        )
    })?;
    let nouns_path = Path::new(&out_dir).join("nouns.rs");
    generate("data/nouns.txt", &nouns_path).map_err(|err| {
        format!(
            "failed to create list of nouns from {}: {}",
            nouns_path.display(),
            err
        )
    })?;

    Ok(())
}
