# Change Log

All notable changes to the "conan-extension" extension will be documented in this file.

## [0.0.3] 2023.6.4

### Fix

- fix syntax highlight not work.

## [0.0.2] - 2023.6.2

### Added

- add VScode Extension icon

## [0.0.1] - 2023.6.2

### Added

- syntax highlight for [requires], [generators], [tool-requires], [test-requires], [options], [layout] for `conanfile.txt`.
- auto completion for `CMakeDeps`, `CMakeToolchain`.
- status bar item called `Conan Install`, click it to run command `conan install . --output-folder=build --build=missing`

### TODO

- [ ] add auto completion for `[requires]`, ...
- [ ] add a json file for custom config.
- [ ] add a side bar containing dependencies in `conanfile.txt` and a tree view for searching package.