#include <boost/asio.hpp>

using boost::asio::ip::tcp;
using boost::asio::awaitable;

constexpr auto use_nothrow_awaitable = boost::asio::as_tuple(boost::asio::use_awaitable);

int main() {
  boost::asio::io_context io_context;

  boost::asio::co_spawn(io_context, [&]() -> awaitable<void> {
    tcp::acceptor acceptor(io_context, tcp::endpoint(tcp::v4(), 1234));
    auto [ec, socket] = co_await acceptor.async_accept(use_nothrow_awaitable);
    if (ec)
      co_return;

    auto buf = boost::asio::buffer("Hello World!\n");
    co_await socket.async_write_some(buf, use_nothrow_awaitable);

    socket.close();
  }, boost::asio::detached);

  io_context.run();
  return 0;
}