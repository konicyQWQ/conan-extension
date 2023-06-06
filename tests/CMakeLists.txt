cmake_minimum_required(VERSION 3.26)

project(conan_test)

set(CMAKE_CXX_COMPILER /opt/homebrew/opt/llvm/bin/clang++)
set(CMAKE_EXPORT_COMPILE_COMMANDS TRUE)

find_package(Boost REQUIRED)

add_executable(main ./src/main.cpp)

target_link_libraries(main Boost::boost)