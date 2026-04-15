package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

type runtimeCase struct {
	CaseID string `json:"case_id"`
}

type tuiCase struct {
	CaseID string `json:"case_id"`
}

func load(path string, out any) error {
	root, err := os.Getwd()
	if err != nil {
		return err
	}
	body, err := os.ReadFile(filepath.Join(root, "..", "..", path))
	if err != nil {
		return err
	}
	return json.Unmarshal(body, out)
}

func main() {
	var runtime runtimeCase
	var tui tuiCase
	if err := load("contracts/runtime/cases/witness.permission_cycle.json", &runtime); err != nil {
		panic(err)
	}
	if err := load("contracts/tui/cases/witness.permission_view.json", &tui); err != nil {
		panic(err)
	}
	if runtime.CaseID == "" || tui.CaseID == "" {
		panic("go sanity consumer failed to parse witness case ids")
	}
	fmt.Printf("runtime=%s\n", runtime.CaseID)
	fmt.Printf("tui=%s\n", tui.CaseID)
}
