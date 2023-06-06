#include <boost/asio.hpp>
#include <boost/asio/co_spawn.hpp>

int main() {
  boost::asio::io_context io_context;

  io_context.run();
  return 0;
}