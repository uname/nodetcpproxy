# nodetcpproxy
###A simple tcp proxy written by nodejs.

There is no command line args for nodetcpproxy,
so if you want to change the ports or remote ip, just edit nodetcpproxy.js.
What you may want to config is in the begining part of nodetcpproxy.js:

![](/config.png)


###A demo for sshd proxy on my VMware
1. Start ubuntu on VMware and get the ip(I use NAT mode, so the ip may be 192.168.45.133)
2. Edit nodetcpproxy.js. Set REMOTE_ADDR as "192.168.45.133" and set REMOTE_PORT as 22(sshd's default port)
3. Goto command line and run "node nodetcpproxy.js"
4. Goto another command line and run "ssh apache@127.0.0.1 -p 8080"(apache is my account name on ubuntu, and 8080 is the LOCAL_PORT in nodetcpproxy.js)

If every things is OK, you will ssh on! And if the var LOG_DATA is true, you will see the communication data on tcp connection.

![](/snapshort.png)
