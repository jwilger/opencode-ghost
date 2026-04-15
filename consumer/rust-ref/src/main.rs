use serde::Deserialize;
use serde_json::{Value, json};
use std::fs;
use std::path::PathBuf;

#[derive(Deserialize)]
struct RuntimeExpect {
    payload: Value,
}

#[derive(Deserialize)]
struct RuntimeCase {
    case_id: String,
    expect: RuntimeExpect,
}

#[derive(Deserialize)]
struct TuiExpect {
    payload: Value,
}

#[derive(Deserialize)]
struct TuiCase {
    case_id: String,
    expect: TuiExpect,
}

#[derive(Deserialize)]
struct Commute {
    case_id: String,
    actual: Value,
    status: String,
}

fn root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .to_path_buf()
}

fn load<T: for<'de> Deserialize<'de>>(path: &str) -> Result<T, String> {
    let body = fs::read_to_string(root().join(path)).map_err(|err| format!("{path}: {err}"))?;
    serde_json::from_str(&body).map_err(|err| format!("{path}: {err}"))
}

fn runtime() -> Result<(), String> {
    let case: RuntimeCase = load("contracts/runtime/cases/witness.permission_cycle.json")?;
    let evidence: Commute = load("evidence/traceability/commuting.runtime.permission_cycle.json")?;
    if case.case_id != evidence.case_id {
        return Err("runtime case/evidence id mismatch".into());
    }
    if evidence.status != "pass" {
        return Err("runtime commuting evidence is not passing".into());
    }
    if case.expect.payload != evidence.actual {
        return Err("runtime case expectation does not match Rust-parsed evidence".into());
    }
    println!("{}", serde_json::to_string_pretty(&evidence.actual).unwrap());
    Ok(())
}

fn tui() -> Result<(), String> {
    let case: TuiCase = load("contracts/tui/cases/witness.permission_view.json")?;
    let evidence: Commute = load("evidence/traceability/commuting.tui.permission_view.json")?;
    if case.case_id != evidence.case_id {
        return Err("tui case/evidence id mismatch".into());
    }
    if evidence.status != "pass" {
        return Err("tui commuting evidence is not passing".into());
    }
    let mut layers = case
        .expect
        .payload
        .get("layers")
        .and_then(|x| x.as_array())
        .cloned()
        .unwrap_or_default();
    layers.sort_by_key(|x| x.as_str().unwrap_or_default().to_string());
    let expected = json!({
        "screens": case.expect.payload.get("screens").cloned().unwrap_or(Value::Null),
        "layers": layers,
        "matrix": case.expect.payload.get("matrix").cloned().unwrap_or(Value::Null),
    });
    if expected != evidence.actual {
        return Err("tui case expectation does not match Rust-parsed evidence".into());
    }
    println!("{}", serde_json::to_string_pretty(&evidence.actual).unwrap());
    Ok(())
}

fn main() {
    let mode = std::env::args().nth(1).unwrap_or_default();
    let out = match mode.as_str() {
        "runtime" => runtime(),
        "tui" => tui(),
        _ => Err("usage: cargo run -- [runtime|tui]".into()),
    };
    if let Err(err) = out {
        eprintln!("{err}");
        std::process::exit(1);
    }
}
