# Change Log

All notable changes to the "conan-extension" extension will be documented in this file.

## [0.0.6] - 2023.6.14

### Added

- more infomation in side bar
  - build options
  - dependencies
- svg for dependencies

## [0.0.5] - 2023.6.7

### Added

- side bar to show dependencies

## [0.0.4] - 2023.6.7

### Added

- custom config args for `conan install`

## [0.0.3] - 2023.6.4

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
